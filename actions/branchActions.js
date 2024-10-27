// @/actions/branchActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Branch from '@/lib/database/models/Branch.model';

// Create a new branch
export const createBranch = async (currentStatus, branchData) => {
  await connectToDatabase();
  try {
    const newBranch = new Branch(branchData);
    const savedBranch = await newBranch.save();

    return {
      _id: savedBranch._id.toString(),
      branchName: savedBranch.branch_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create branch.' };
  }
};

// Update an existing branch
export const updateBranch = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedBranch._id.toString(),
      branchName: updatedBranch.branch_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update branch.' };
  }
};

// Delete a branch
export const deleteBranch = async (id) => {
  await connectToDatabase();
  try {
    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) {
      return { success: false, error: true, message: 'Branch not found' };
    }
    return { success: true, error: false, message: 'Branch deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete branch.' };
  }
};

// Get branches with optional pagination
export const getBranches = async () => {
  await connectToDatabase();
  const branches = await Branch.find({}) 
    .lean();
  return branches.map(branch => ({
    ...branch,
    _id: branch._id.toString(),
  }));
};

// Get the total number of branches
export const getBranchesCount = async () => {
  await connectToDatabase();
  return await Branch.countDocuments();
};
