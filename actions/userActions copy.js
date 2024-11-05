// @/actions/userActions.js
"use server"

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import Role from '@/lib/database/models/Role.model';
import Department from '@/lib/database/models/Department.model';
import Branch from '@/lib/database/models/Branch.model';
import { clerkClient } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

export const getUserById = async (id) => {
  await connectToDatabase()

  try {
    const user = await User.findById(id).populate('roles departments branches')
    if (!user) {
      return null
    }

    // Convert MongoDB data to a plain JavaScript object
    return {
      ...user.toObject(),
      _id: user._id.toString(),
      roles: user.roles.map((role) => ({
        _id: role._id.toString(),
        role_name: role.role_name,
      })),
      departments: user.departments.map((dept) => ({
        _id: dept._id.toString(),
        department_name: dept.department_name,
      })),
      branches: user.branches.map((branch) => ({
        _id: branch._id.toString(),
        branch_name: branch.branch_name,
      })),
    }
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}

// New function to get user by username with populated fields
export const getUserByUsername = async (username) => {
  await connectToDatabase();

  try {
    const user = await User.findOne({ login_id: username })
      .populate({
        path: 'roles',
        populate: {
          path: 'department',
          model: 'Department',
        },
      })
      .populate('departments branches')
      .lean(); // Convert to plain JavaScript object

    if (!user) {
      return null;
    }

    // Convert ObjectId fields to strings for consistent output and handle null values
    return {
      ...user,
      _id: user._id?.toString(),
      roles: user.roles?.map((role) => ({
        _id: role._id?.toString(),
        role_name: role.role_name,
        department: role.department
          ? {
              _id: role.department._id?.toString(),
              department_name: role.department.department_name,
            }
          : null,
        // Directly include module_access as-is
        module_access: role.module_access?.map((module) => ({
          module_name: module.module_name,
          ...module, // Spread operator to include all fields in module_access as-is
        })) || [],
        active_status: role.active_status,
      })) || [],
      departments: user.departments?.map((dept) => ({
        _id: dept._id?.toString(),
        department_name: dept.department_name,
      })) || [],
      branches: user.branches?.map((branch) => ({
        _id: branch._id?.toString(),
        branch_name: branch.branch_name,
      })) || [],
    };
  } catch (error) {
    console.error("Failed to fetch user by username:", error);
    return null;
  }
};


export const getUsers = async () => {
  await connectToDatabase();
  const users = await User.find({})
    .populate('roles')
    .populate('departments')
    .populate('branches')
    .lean(); // Convert to plain JavaScript objects

  // Convert ObjectId fields to string
  return users.map(user => ({
    ...user,
    _id: user._id.toString(),
    roles: user.roles.map(role => ({
      ...role,
      _id: role._id.toString(),
    })),
    departments: user.departments.map(dept => ({
      ...dept,
      _id: dept._id.toString(),
    })),
    branches: user.branches.map(branch => ({
      ...branch,
      _id: branch._id.toString(),
    })),
  }));
};

// Create a new user
export const createUser = async (currentState, userData) => {
  await connectToDatabase();

  console.log('==userData==server actions===');
  console.log(userData);
  console.log('==userData==server actions==');

  
  try {
   
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
export const updateUser = async (currentState, updateData) => {
  await connectToDatabase();

  const id = updateData.id;
  
  console.log('==updateData==server actions===');
  // console.log(id);
  console.log(updateData);
  console.log('==updateData==server actions==');
  

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

    console.log('===updatedUser==SA==');
    console.log(updatedUser);
    console.log('===updatedUser==SA===');

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
export const deleteUser = async (id) => {
  await connectToDatabase();
  
  console.log('==id=SA==');
  console.log(id);
  console.log('==id=SA=');

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
