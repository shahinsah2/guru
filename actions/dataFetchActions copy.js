// @/actions/dataFetchActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import Department from '@/lib/database/models/Department.model';
import Role from '@/lib/database/models/Role.model';
import Branch from '@/lib/database/models/Branch.model';

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

// Fetch the total number of users
export const getUsersCount = async () => {
  await connectToDatabase();
  return await User.countDocuments();
};

export const getAllRoles = async () => {
  await connectToDatabase();
  const roles = await Role.find().lean();
  return roles.map(role => ({
    ...role,
    _id: role._id.toString(),
  }));
};

export const getAllDepartments = async () => {
  await connectToDatabase();
  const departments = await Department.find().lean();
  return departments.map(dept => ({
    ...dept,
    _id: dept._id.toString(),
  }));
};

export const getAllBranches = async () => {
  await connectToDatabase();
  const branches = await Branch.find().lean();
  return branches.map(branch => ({
    ...branch,
    _id: branch._id.toString(),
  }));
};