// @/app/api/user/route.js

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import mongoose from 'mongoose';
import { clerkClient } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/actions/userActions';

// GET all users
export async function GET() {
  try {
    await connectToDatabase();

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready');
    }

    const users = await User.find().populate('roles departments branches');
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ message: 'Error fetching users', error: error.message }), { status: 500 });
  }
}

// POST (create) a new user
export async function POST(req) {
  try {
    await connectToDatabase();
    const userData = await req.json();

    console.log('Received data for new user creation:', userData);

    // Create a new user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [userData.emailid],
      password: userData.password,
      username: userData.login_id,
    });

    console.log('Clerk user created:', clerkUser);

    // Add clerk ID to userData and create the user in MongoDB
    userData.clerkid = clerkUser.id;
    const savedUser = await createUser(userData);

    // Update Clerk's public metadata with roles and MongoDB user ID
    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        roles: userData.roles,
        dbid: savedUser._id.toString(),
      },
    });

    console.log('User created successfully in MongoDB and Clerk:', savedUser);

    return new Response(JSON.stringify({ message: 'User created successfully!', user: savedUser }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: 'Error creating user', error: error.message }), { status: 500 });
  }
}

// PUT (update) a user
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    console.log('Received update request for user ID:', id);
    console.log('Update data:', updateData);

    const updatedUser = await updateUser(id, updateData);

    console.log('User updated successfully in MongoDB:', updatedUser);

    // Update Clerk metadata if Clerk ID is available
    if (updatedUser.clerkid) {
      try {
        await clerkClient.users.updateUserMetadata(updatedUser.clerkid, {
          publicMetadata: {
            roles: updateData.roles || [],
            dbid: updatedUser._id.toString(),
          },
        });
        console.log('Clerk metadata updated successfully for user:', updatedUser.clerkid);
      } catch (clerkError) {
        console.error('Failed to update Clerk metadata:', clerkError);
        return new Response(JSON.stringify({ message: 'Error updating Clerk metadata', error: clerkError.message }), { status: 500 });
      }
    } else {
      console.error('Clerk ID is missing for user:', id);
      return new Response(JSON.stringify({ message: 'Clerk ID is missing' }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'User updated successfully!', user: updatedUser }), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ message: 'Error updating user', error: error.message }), { status: 500 });
  }
}

// DELETE a user
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const deletedUser = await deleteUser(id);
    console.log('User deleted successfully from MongoDB:', deletedUser);

    // Remove user from Clerk as well
    if (deletedUser.clerkid) {
      try {
        await clerkClient.users.deleteUser(deletedUser.clerkid);
        console.log('User deleted successfully from Clerk:', deletedUser.clerkid);
      } catch (clerkError) {
        console.error('Failed to delete user from Clerk:', clerkError);
        return new Response(JSON.stringify({ message: 'Error deleting user from Clerk', error: clerkError.message }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ message: 'Error deleting user', error: error.message }), { status: 500 });
  }
}
