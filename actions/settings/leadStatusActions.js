// @/actions/settings/leadStatusActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import LeadStatus from '@/lib/database/models/LeadStatus.model';

// Get all lead statuses
export const getLeadStatuses = async () => {
  await connectToDatabase();
  const statuses = await LeadStatus.find({}).lean();
  return statuses.map(status => ({
    ...status,
    _id: status._id.toString(),
  }));
};

// Get a single lead status by ID
export const getLeadStatusById = async (id) => {
  await connectToDatabase();
  const status = await LeadStatus.findById(id).lean();
  if (!status) {
    return { success: false, error: true, message: 'Lead Status not found' };
  }
  return { ...status, _id: status._id.toString() };
};

// Create a new lead status
export const createLeadStatus = async (currentStatus, leadStatusData) => {
  await connectToDatabase();

  // Check if status_name is provided
  if (!leadStatusData.status_name) {
    return { success: false, error: true, message: 'Lead Status Name is required' };
  }

  // Check for existing status with the same name
  const existingStatus = await LeadStatus.findOne({ status_name: leadStatusData.status_name });
  if (existingStatus) {
    return { success: false, error: true, message: 'Lead Status already exists' };
  }

  try {
    const newLeadStatus = new LeadStatus(leadStatusData);
    const savedLeadStatus = await newLeadStatus.save();
    return {
      _id: savedLeadStatus._id.toString(),
      statusName: savedLeadStatus.status_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create lead status.' };
  }
};

// Update an existing lead status
export const updateLeadStatus = async (currentStatus, updateData) => {

  console.log('=====updateData==sa==');
  console.log(updateData);
  console.log('==updateData====');
  await connectToDatabase();
  const id = updateData.id;

  // Check if lead status exists
  const existingStatus = await LeadStatus.findById(id);
  if (!existingStatus) {
    return { success: false, error: true, message: 'Lead Status not found' };
  }

  try {
    const updatedLeadStatus = await LeadStatus.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedLeadStatus._id.toString(),
      statusName: updatedLeadStatus.status_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update lead status.' };
  }
};

// Delete a lead status
export const deleteLeadStatus = async (id) => {
  await connectToDatabase();
  try {
    const deletedLeadStatus = await LeadStatus.findByIdAndDelete(id);
    if (!deletedLeadStatus) {
      return { success: false, error: true, message: 'Lead Status not found' };
    }
    return { success: true, error: false, message: 'Lead Status deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete lead status.' };
  }
};
