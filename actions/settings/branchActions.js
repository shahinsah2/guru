// @/actions/settings/branchActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Branch from '@/lib/database/models/Branch.model';
import Country from '@/lib/database/models/Country.model';
import State from '@/lib/database/models/State.model';
import City from '@/lib/database/models/City.model';

// Get all branches
export const getBranches = async () => {
    await connectToDatabase();
    const branches = await Branch.find({})
      .populate({ path: 'country', model: Country, strictPopulate: false })
      .populate({ path: 'state', model: State, strictPopulate: false })
      .populate({ path: 'city', model: City, strictPopulate: false })
      .lean();
    return branches.map(branch => ({
      ...branch,
      _id: branch._id.toString(),
      country: branch.country ? branch.country._id.toString() : null,
      state: branch.state ? branch.state._id.toString() : null,
      city: branch.city ? branch.city._id.toString() : null,
    }));
  };
  
  // Get a single branch by ID
  export const getBranchById = async (id) => {
    await connectToDatabase();
    const branch = await Branch.findById(id)
      .populate({ path: 'country', model: Country, strictPopulate: false })
      .populate({ path: 'state', model: State, strictPopulate: false })
      .populate({ path: 'city', model: City, strictPopulate: false })
      .lean();
    if (!branch) {
      return { success: false, error: true, message: 'Branch not found' };
    }
    return { ...branch, _id: branch._id.toString() };
  };

// Create a new branch
export const createBranch = async (currentState, branchData) => {
    console.log('==branchData==sa===');
    console.log(branchData); // Debugging: Check the received data
    console.log('====branchData======');
  
    await connectToDatabase();
  
    // Check if branch_id is provided
    if (!branchData.branch_id) {
      return { success: false, error: true, message: 'Branch ID is missing in the provided data' };
    }
  
    // Check for existing branch with the same ID
    const existingBranch = await Branch.findOne({ branch_id: branchData.branch_id });
    if (existingBranch) {
      return { success: false, error: true, message: 'Branch ID already exists' };
    }
  
    try {
      const newBranch = new Branch(branchData);
      const savedBranch = await newBranch.save();
      return { success: true, branch: savedBranch.toObject() };
    } catch (error) {
      console.error('Error creating branch:', error); // Log the error for debugging
      return { success: false, error: true, message: error.message || 'Failed to create branch' };
    }
  };

// Update an existing branch
export const updateBranch = async (currentState, updateData) => {
    await connectToDatabase();
  const id = updateData.id;
    console.log('==updateData=====');
    console.log(updateData);
    console.log('==updateData====');
  try {
    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBranch) {
      return { success: false, error: true, message: 'Branch not found' };
    }
    return { success: true, branch: updatedBranch.toObject() };
  } catch (error) {
    return { success: false, error: true, message: 'Failed to update branch' };
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
    return { success: true, message: 'Branch deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: 'Failed to delete branch' };
  }
};
