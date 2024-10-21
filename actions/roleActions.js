// @/actions/roleActions.js

import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';
import Department from '@/lib/database/models/Department.model';
import mongoose from 'mongoose';

// Helper function to convert department name to ObjectId
const getDepartmentObjectId = async (departmentName) => {
  const department = await Department.findOne({ department_name: departmentName });
  if (department) {
    return new mongoose.Types.ObjectId(department._id);
  }
  throw new Error(`Department not found: ${departmentName}`);
};

// Create a new role
export const createRole = async (roleData) => {
  await connectToDatabase();

  // Convert department name to ObjectId
  const departmentId = await getDepartmentObjectId(roleData.department);

  const newRole = new Role({
    ...roleData,
    department: departmentId,
  });
  return await newRole.save();
};

// Retrieve a role by ID
export const getRoleById = async (id) => {
  await connectToDatabase();
  const role = await Role.findById(id).populate('department');
  if (!role) {
    throw new Error('Role not found');
  }
  return role;
};

// Retrieve all roles
export const getAllRoles = async () => {
  await connectToDatabase();
  // Populate the department to get the department name
  return await Role.find({}).populate('department', 'department_name').lean();
};

// Update an existing role
export const updateRole = async (id, updateData) => {
  await connectToDatabase();

  // Convert department name to ObjectId if updating department
  if (updateData.department) {
    updateData.department = await getDepartmentObjectId(updateData.department);
  }

  const updatedRole = await Role.findByIdAndUpdate(id, updateData, { new: true }).populate('department');
  if (!updatedRole) {
    throw new Error('Role not found');
  }
  return updatedRole;
};

// Delete a role
export const deleteRole = async (id) => {
  await connectToDatabase();
  const deletedRole = await Role.findByIdAndDelete(id);
  if (!deletedRole) {
    throw new Error('Role not found');
  }
  return deletedRole;
};
