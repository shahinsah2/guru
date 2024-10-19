// @/actions/departmentActions.js

import { connectToDatabase } from '@/lib/database';
import Department from '@/lib/database/models/Department.model';

// Create a new department
export const createDepartment = async (departmentData) => {
  await connectToDatabase();

  const newDepartment = new Department({
    ...departmentData,
  });
  return await newDepartment.save();
};

// Retrieve a department by ID
export const getDepartmentById = async (id) => {
  await connectToDatabase();
  const department = await Department.findById(id);
  if (!department) {
    throw new Error('Department not found');
  }
  return department;
};

// Retrieve all departments
export const getAllDepartments = async () => {
  await connectToDatabase();
  return await Department.find({});
};

// Update an existing department
export const updateDepartment = async (id, updateData) => {
  await connectToDatabase();

  const updatedDepartment = await Department.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedDepartment) {
    throw new Error('Department not found');
  }
  return updatedDepartment;
};

// Delete a department
export const deleteDepartment = async (id) => {
  await connectToDatabase();
  const deletedDepartment = await Department.findByIdAndDelete(id);
  if (!deletedDepartment) {
    throw new Error('Department not found');
  }
  return deletedDepartment;
};
