// @/actions/settings/departmentActions.js

"use server";

import { connectToDatabase } from "@/lib/database";
import Department from "@/lib/database/models/Department.model";

// Get all departments
export const getDepartments = async () => {
  await connectToDatabase();
  const departments = await Department.find({}).lean();
  return departments.map((dept) => ({
    ...dept,
    _id: dept._id.toString(),
  }));
};

// Get a single department by ID
export const getDepartmentById = async (id) => {
  await connectToDatabase();
  const department = await Department.findById(id).lean();
  if (!department) {
    return { success: false, error: true, message: "Department not found" };
  }
  return { ...department, _id: department._id.toString() };
};

// Create a new department
export const createDepartment = async (currentState, departmentData) => {
  await connectToDatabase();
  const existingDept = await Department.findOne({ department_name: departmentData.department_name });
  if (existingDept) {
    return { success: false, error: true, message: "Department name already exists" };
  }
  try {
    const newDept = new Department(departmentData);
    const savedDept = await newDept.save();
    return { success: true, department: savedDept.toObject() };
  } catch (error) {
    return { success: false, error: true, message: error.message || "Failed to create department" };
  }
};

// Update an existing department
export const updateDepartment = async (currentState, updateData) => {
  const id = updateData.id;

  console.log('====updateData==sa===');
  console.log(updateData);
  console.log('=====updateData====');
  await connectToDatabase();
  try {
    const updatedDept = await Department.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDept) {
      return { success: false, error: true, message: "Department not found" };
    }
    return { success: true, department: updatedDept.toObject() };
  } catch (error) {
    return { success: false, error: true, message: error.message || "Failed to update department" };
  }
};

// Delete a department
export const deleteDepartment = async (id) => {
  await connectToDatabase();
  try {
    const deletedDept = await Department.findByIdAndDelete(id);
    if (!deletedDept) {
      return { success: false, error: true, message: "Department not found" };
    }
    return { success: true, message: "Department deleted successfully" };
  } catch (error) {
    return { success: false, error: true, message: "Failed to delete department" };
  }
};
