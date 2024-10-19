// @/actions/branchActions.js

import { connectToDatabase } from '@/lib/database';
import Branch from '@/lib/database/models/Branch.model';

// Create a new branch
export const createBranch = async (branchData) => {
  await connectToDatabase();

  const newBranch = new Branch({
    ...branchData,
  });
  return await newBranch.save();
};

// Retrieve a branch by ID
export const getBranchById = async (id) => {
  await connectToDatabase();
  const branch = await Branch.findById(id);
  if (!branch) {
    throw new Error('Branch not found');
  }
  return branch;
};

// Retrieve all branches
export const getAllBranches = async () => {
  await connectToDatabase();
  return await Branch.find({});
};

// Update an existing branch
export const updateBranch = async (id, updateData) => {
  await connectToDatabase();

  const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedBranch) {
    throw new Error('Branch not found');
  }
  return updatedBranch;
};

// Delete a branch
export const deleteBranch = async (id) => {
  await connectToDatabase();
  const deletedBranch = await Branch.findByIdAndDelete(id);
  if (!deletedBranch) {
    throw new Error('Branch not found');
  }
  return deletedBranch;
};
