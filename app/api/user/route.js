// app/api/user/route.js

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import mongoose from 'mongoose'; // Import mongoose for ObjectId conversion
import { clerkClient } from '@clerk/nextjs/server';


// GET all users
export async function GET() {
  try {
    await connectToDatabase();

    // Ensure Mongoose connection is ready before making a query
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready');
    }

    const users = await User.find().populate('roles departments branches'); // Updated to pluralize relationships
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching users', error }), { status: 500 });
  }
}

// POST (create) a new user
export async function POST(req) {
  try {
    await connectToDatabase();
    const userData = await req.json();
    
    console.log('==userData===');
    console.log(userData);
    console.log('==userData===');

     // Create a user in Clerk
     const clerkUser = await clerkClient.users.createUser({
      emailAddress: [userData.emailid],
      password: userData.password,
      username: userData.login_id,
    });

    console.log('== Clerk user created ==', clerkUser);

    // Convert roles, departments, and branches to ObjectId arrays using 'new' keyword
    const newUser = new User({
      ...userData,
      roles: userData.roles.map((roleId) => new mongoose.Types.ObjectId(roleId)), // Ensuring roles is being mapped
      departments: userData.departments.map((deptId) => new mongoose.Types.ObjectId(deptId)),
      branches: userData.branches.map((branchId) => new mongoose.Types.ObjectId(branchId)),
      clerkid: clerkUser.id,
    });

    await newUser.save();

    console.log('==newUser===');
    console.log(newUser);
    console.log('==newUser===');

    const savedUser = await newUser.save();

    // Update Clerk's public metadata with roles and dbid (MongoDB user ID)
    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        roles: userData.roles,
        dbid: savedUser._id.toString(), // Store MongoDB user ID as dbid
      },
    });

    return new Response(JSON.stringify({ message: 'User created successfully!', user: savedUser }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: 'Error creating user', error }), { status: 500 });
  }
}

// PUT (update) a user
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    console.log(id);
    

     // Find the user in MongoDB
     const user = await User.findById(id);
     console.log(user);
     
     if (!user) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
 

    // Ensure roles, departments, and branches are converted to ObjectIds
    if (updateData.roles) {
      updateData.roles = updateData.roles.map((roleId) => new mongoose.Types.ObjectId(roleId));
    }
    if (updateData.departments) {
      updateData.departments = updateData.departments.map((deptId) => new mongoose.Types.ObjectId(deptId));
    }
    if (updateData.branches) {
      updateData.branches = updateData.branches.map((branchId) => new mongoose.Types.ObjectId(branchId));
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).populate('roles departments branches');
    if (!updatedUser) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

      // Update Clerk's public metadata with updated roles and dbid
    await clerkClient.users.updateUserMetadata(user.clerkid, {
      publicMetadata: {
        roles: updateData.roles,
        dbid: updatedUser._id.toString(), // Ensure MongoDB user ID is present in Clerk metadata
      },
    });

    return new Response(JSON.stringify({ message: 'User updated successfully!', user: updatedUser }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating user', error }), { status: 500 });
  }
}


// DELETE a user
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'User deleted successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting user', error }), { status: 500 });
  }
}
