// app/api/user/route.ts

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import mongoose from 'mongoose'; // Import mongoose for ObjectId conversion

// GET all users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().populate('roles departments branches'); // Updated to pluralize relationships
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching users', error }), { status: 500 });
  }
}

// POST (create) a new user
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const userData = await req.json();

    console.log('==userData===');
    console.log(userData);
    console.log('==userData===');

    // Convert roles, departments, and branches to ObjectId arrays using 'new' keyword
    const newUser = new User({
      ...userData,
      roles: userData.roles.map((roleId: string) => new mongoose.Types.ObjectId(roleId)), // Ensuring roles is being mapped
      departments: userData.departments.map((deptId: string) => new mongoose.Types.ObjectId(deptId)),
      branches: userData.branches.map((branchId: string) => new mongoose.Types.ObjectId(branchId)),
    });

    await newUser.save();

    console.log('==newUser===');
    console.log(newUser);
    console.log('==newUser===');

    return new Response(JSON.stringify({ message: 'User created successfully!', user: newUser }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: 'Error creating user', error }), { status: 500 });
  }
}

// PUT (update) a user
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    // Ensure roles, departments, and branches are converted to ObjectIds
    if (updateData.roles) {
      updateData.roles = updateData.roles.map((roleId: string) => new mongoose.Types.ObjectId(roleId));
    }
    if (updateData.departments) {
      updateData.departments = updateData.departments.map((deptId: string) => new mongoose.Types.ObjectId(deptId));
    }
    if (updateData.branches) {
      updateData.branches = updateData.branches.map((branchId: string) => new mongoose.Types.ObjectId(branchId));
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).populate('roles departments branches');
    if (!updatedUser) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'User updated successfully!', user: updatedUser }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating user', error }), { status: 500 });
  }
}


// DELETE a user
export async function DELETE(req: Request) {
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
