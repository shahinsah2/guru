// @/actions/departmentActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Department from '@/lib/database/models/Department.model';

// Create a new department
export const createDepartment = async (currentStatus, departmentData) => {
  await connectToDatabase();
  try {
    const newDepartment = new Department(departmentData);
    const savedDepartment = await newDepartment.save();

    return {
      _id: savedDepartment._id.toString(),
      departmentName: savedDepartment.department_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create department.' };
  }
};

// Update an existing department
export const updateDepartment = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedDepartment._id.toString(),
      departmentName: updatedDepartment.department_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update department.' };
  }
};

// Delete a department
export const deleteDepartment = async (id) => {
  await connectToDatabase();
  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return { success: false, error: true, message: 'Department not found' };
    }
    return { success: true, error: false, message: 'Department deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete department.' };
  }
};

// Get departments with optional pagination
export const getDepartments = async () => {
  await connectToDatabase();
  const departments = await Department.find({})  
    .lean();
  return departments.map(department => ({
    ...department,
    _id: department._id.toString(),
  }));
};

// Get the total number of departments
export const getDepartmentsCount = async () => {
  await connectToDatabase();
  return await Department.countDocuments();
};
