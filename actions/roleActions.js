// @/actions/roleActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';

// Create a new role
export const createRole = async (roleData) => {
  await connectToDatabase();
  try {
    const newRole = new Role(roleData);
    const savedRole = await newRole.save();

    return {
      _id: savedRole._id.toString(),
      roleName: savedRole.role_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create role.' };
  }
};

// Update an existing role
export const updateRole = async (id, updateData) => {
  await connectToDatabase();
  try {
    const updatedRole = await Role.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedRole._id.toString(),
      roleName: updatedRole.role_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update role.' };
  }
};

// Delete a role
export const deleteRole = async (currentState, formData) => {
  const id = formData.get("id");
  await connectToDatabase();
  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return { success: false, error: true, message: 'Role not found' };
    }
    return { success: true, error: false, message: 'Role deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete role.' };
  }
};

// Get roles with optional pagination
export const getRoles = async ({ skip = 0, limit = 10 } = {}) => {
  await connectToDatabase();
  const roles = await Role.find({})
    .skip(skip)
    .limit(limit)
    .populate('department')
    .lean();
  return roles.map(role => ({
    ...role,
    _id: role._id.toString(),
    department: role.department ? role.department.department_name : 'No Department', // Handle null case
  }));
};


// Get the total number of roles
export const getRolesCount = async () => {
  await connectToDatabase();
  return await Role.countDocuments();
};
