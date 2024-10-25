// @/actions/dataFetchActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import Department from '@/lib/database/models/Department.model';
import Role from '@/lib/database/models/Role.model';
import Branch from '@/lib/database/models/Branch.model';

// Fetch users by login_id with populated fields
export const getUsersByLoginId = async (loginId) => {
  await connectToDatabase();
  return await User.findOne({ login_id: loginId })
    .populate('roles')
    .populate('departments')
    .populate('branches')
    .lean();
};

// Fetch users with optional pagination
export const getUsers = async ({ skip = 0, limit = 10 } = {}) => {
  await connectToDatabase();
  return await User.find({})
    .skip(skip)
    .limit(limit)
    .populate('roles')
    .populate('departments')
    .populate('branches')
    .lean();
};

// Fetch the total number of users
export const getUsersCount = async () => {
  await connectToDatabase();
  return await User.countDocuments();
};

export const getDepartments = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await Department.find().lean();
};

export const getRoles = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await Role.find().populate('department').lean();
};

export const getBranches = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await Branch.find().lean();
};
