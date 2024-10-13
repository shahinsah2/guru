// @/actions/getRolesByIds.js
import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';
import mongoose from 'mongoose';

export const getRolesByIds = async (roleIds) => {
  "use server";

  await connectToDatabase();

  // Convert roleIds into ObjectId instances
  const objectIds = roleIds.map((roleId) => new mongoose.Types.ObjectId(roleId));

  // Find roles matching the provided role IDs and populate department
  const roles = await Role.find({ _id: { $in: objectIds } }).populate('role_name','module_access');

  return roles;
};
