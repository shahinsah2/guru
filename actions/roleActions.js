// @/actions/settings/roleActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';

// Get all roles
export const getRoles = async () => {
  await connectToDatabase();
  const roles = await Role.find({}).populate('department').lean();
  return roles.map(role => ({
    ...role,
    _id: role._id.toString(),
    department: role.department ? role.department._id.toString() : null,
  }));
};

// Get a single role by ID
export const getRoleById = async (id) => {
  await connectToDatabase();
  const role = await Role.findById(id).populate('department').lean();
  if (!role) {
    return null;
  }
  
  // Ensure each permission in `module_access` has all permission keys with default values
  const permissionKeys = [
    "can_add", "can_edit", "can_delete", "can_activate", "can_deactivate",
    "can_search", "can_import", "can_export", "can_print",
    "can_generate_pdf", "can_logout"
  ];
  
  const formattedModuleAccess = (role.module_access || []).map((module) => {
    const permissions = permissionKeys.reduce((acc, key) => {
      acc[key] = module.permissions?.[key] ?? false; // Default to false if not present
      return acc;
    }, {});
    return { module_name: module.module_name, permissions };
  });

  return {
    ...role,
    _id: role._id.toString(),
    department: role.department ? role.department._id.toString() : null,
    module_access: formattedModuleAccess,
  };
};

// Create a new role
export const createRole = async (currentState, roleData) => {
  await connectToDatabase();    
  const newRole = new Role(roleData);
  const savedRole = await newRole.save();
  return { success: true, role: savedRole.toObject() };
};

// Update an existing role
export const updateRole = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedRole = await Role.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedRole) {
    return { success: false, message: 'Role not found' };
  }
  return { success: true, role: updatedRole.toObject() };
};

// Delete a role
export const deleteRole = async (id) => {
  await connectToDatabase();
  const deletedRole = await Role.findByIdAndDelete(id);
  if (!deletedRole) {
    return { success: false, message: 'Role not found' };
  }
  return { success: true, message: 'Role deleted successfully' };
};
