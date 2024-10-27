// @/actions/dataFetchActions.js
"use server"

import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';
import Department from '@/lib/database/models/Department.model';
import Branch from '@/lib/database/models/Branch.model';
import User from '@/lib/database/models/User.model';

export const getUsersByLoginId = async (loginId) => {
  await connectToDatabase();
  const user = await User.findOne({ login_id: loginId })
    .populate('roles')
    .populate('departments')
    .populate('branches')
    .lean(); // Convert to plain JavaScript object

  // Convert ObjectId fields to string
  if (user) {
    return {
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
    };
  }
  return null;
};

// Fetch all roles
export const getAllRoles = async () => {
  await connectToDatabase();
  return await Role.find().lean();
};

// Fetch all departments
export const getAllDepartments = async () => {
  await connectToDatabase();
  return await Department.find().lean();
};

// Fetch all branches
export const getAllBranches = async () => {
  await connectToDatabase();
  return await Branch.find().lean();
};

// Fetch user by ID
export const getUserById = async (id) => {
  await connectToDatabase();
  return await User.findById(id).populate('roles departments branches').lean();
};
