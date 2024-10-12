// @/actions/dataFetchActions.js
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';
import Department from '@/lib/database/models/Department.model';
import Role from '@/lib/database/models/Role.model';
import Branch from '@/lib/database/models/Branch.model';

export const getUsers = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await User.find().populate('roles departments branches');
};

export const getDepartments = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await Department.find();
};

export const getRoles = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await Role.find().populate('department');
};

export const getBranches = async () => {
  "use server"; // Server action
  await connectToDatabase();
  return await Branch.find();
};
