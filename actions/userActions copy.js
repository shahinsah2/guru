// @/actions/userActions.js
"use server"

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import { clerkClient } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// Regular expression for validating email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create a new user
export const createUser = async (currentState, userData) => {
  await connectToDatabase();

  console.log('==userData==server actions===');
  console.log(userData);
  console.log('==userData==server actions==');

  // Validate the email format before proceeding
  if (!emailRegex.test(userData.emailid)) {
    return { success: false, error: true, message: 'Invalid email format. Please enter a valid email address.' };
  }

  try {
    // Check if a user with the given email already exists in Clerk
    const existingUsers = await clerkClient.users.getUserList({
      emailAddress: [userData.emailid],
    });

    if (existingUsers.length > 0) {
      return { success: false, error: true, message: 'A user with this email already exists.' };
    }

    // Proceed with creating the user in Clerk if no existing user is found
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [userData.emailid],
      password: userData.password,
      username: userData.login_id,
    });

    console.log('==clerkUser=====');
    console.log(clerkUser);
    console.log('==clerkUser====');

    // Add Clerk ID to userData
    userData.clerkid = clerkUser.id;

    // Create a new user in MongoDB
    const newUser = new User({
      ...userData,
      roles: userData.roles.map(roleId => new mongoose.Types.ObjectId(roleId)),
      departments: userData.departments.map(deptId => new mongoose.Types.ObjectId(deptId)),
      branches: userData.branches.map(branchId => new mongoose.Types.ObjectId(branchId)),
    });

    const savedUser = await newUser.save();

    // Update Clerk's public metadata
    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        roles: userData.roles,
        dbid: savedUser._id.toString(),
      },
    });

    // Return only plain data
    return {
      _id: savedUser._id.toString(),
      firstName: savedUser.first_name,
      lastName: savedUser.last_name,
      email: savedUser.emailid,
      clerkId: savedUser.clerkid,
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error.errors);
    // Provide a user-friendly error message
    return { success: false, error: true, message: error?.errors[0]?.message || 'Failed to create user. Please try again.' };
  }
};

// Update an existing user
export const updateUser = async (id, updateData) => {
  await connectToDatabase();

  try {
    // Find and update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .populate('roles departments branches');

    // Update Clerk metadata if Clerk ID is available
    if (updatedUser.clerkid) {
      await clerkClient.users.updateUserMetadata(updatedUser.clerkid, {
        publicMetadata: {
          roles: updateData.roles || [],
          dbid: updatedUser._id.toString(),
        },
      });
    }

    // Return a plain object instead of the Mongoose document
    return {
      _id: updatedUser._id.toString(),
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.emailid,
      clerkId: updatedUser.clerkid,
      success: true,
      error: false,
    };
  } catch (error) {
    // Handle the error and return a plain object
    return { success: false, error: true, message: error.message || 'Failed to update user. Please try again.' };
  }
};

// Delete a user
export const deleteUser = async (currentState, formData) => {
  await connectToDatabase();

  const id = formData.get("id");

  try {
    // Find and delete the user in the database
    const deletedUser = await User.findByIdAndDelete(id);

    console.log(deletedUser);
    

    if (!deletedUser) {
      // Return a plain object indicating failure
      return { success: false, error: true, message: 'User not found' };
    }

    // Remove the user from Clerk if Clerk ID is available
    if (deletedUser.clerkid) {
      await clerkClient.users.deleteUser(deletedUser.clerkid);
    }

    // Return a plain object indicating success
    return { success: true, error: false, message: 'User deleted successfully' };
  } catch (error) {
    // Handle the error and return a plain object
    return { success: false, error: true, message: error.message || 'Failed to delete user. Please try again.' };
  }
};
