// @/actions/userActions.js

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import Role from '@/lib/database/models/Role.model';
import Department from '@/lib/database/models/Department.model';
import Branch from '@/lib/database/models/Branch.model';
import mongoose from 'mongoose';

// Helper function to convert names to ObjectIds
const getObjectIdFromName = async (model, name) => {
  const record = await model.findOne({ $or: [{ role_name: name }, { department_name: name }, { branch_name: name }] });
  if (record) {
    return new mongoose.Types.ObjectId(record._id);
  }
  throw new Error(`Invalid ID for name: ${name}`);
};

// Create a new user
export const createUser = async (userData) => {
  await connectToDatabase();
  const newUser = new User({
    ...userData,
    roles: userData.roles.map(roleId => new mongoose.Types.ObjectId(roleId)),
    departments: userData.departments.map(deptId => new mongoose.Types.ObjectId(deptId)),
    branches: userData.branches.map(branchId => new mongoose.Types.ObjectId(branchId)),
  });
  return await newUser.save();
};

// Update an existing user
export const updateUser = async (id, updateData) => {
  await connectToDatabase();

  // Convert role names to ObjectIds
  if (updateData.roles) {
    updateData.roles = await Promise.all(
      updateData.roles.map(async (roleName) => {
        return getObjectIdFromName(Role, roleName);
      })
    );
  }

  // Convert department names to ObjectIds
  if (updateData.departments) {
    updateData.departments = await Promise.all(
      updateData.departments.map(async (deptName) => {
        return getObjectIdFromName(Department, deptName);
      })
    );
  }

  // Convert branch names to ObjectIds
  if (updateData.branches) {
    updateData.branches = await Promise.all(
      updateData.branches.map(async (branchName) => {
        return getObjectIdFromName(Branch, branchName);
      })
    );
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).populate('roles departments branches');
  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

// Delete a user
export const deleteUser = async (id) => {
  await connectToDatabase();
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};
