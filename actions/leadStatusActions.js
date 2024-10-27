// @/actions/leadStatusActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import LeadStatus from '@/lib/database/models/LeadStatus.model';

// Create a new lead status
export const createLeadStatus = async (currentStatus, statusData) => {
  await connectToDatabase();
  try {
    const newStatus = new LeadStatus(statusData);
    const savedStatus = await newStatus.save();

    return {
      _id: savedStatus._id.toString(),
      statusName: savedStatus.status_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create lead status.' };
  }
};

// Update an existing lead status
export const updateLeadStatus = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedStatus = await LeadStatus.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedStatus._id.toString(),
      statusName: updatedStatus.status_name,
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
    const deletedStatus = await LeadStatus.findByIdAndDelete(id);
    if (!deletedStatus) {
      return { success: false, error: true, message: 'Lead status not found' };
    }
    return { success: true, error: false, message: 'Lead status deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete lead status.' };
  }
};

// Get lead statuses with optional pagination
export const getLeadStatuses = async ({ skip = 0, limit = 10 } = {}) => {
  await connectToDatabase();
  const statuses = await LeadStatus.find({})
    .skip(skip)
    .limit(limit)
    .lean();
  return statuses.map(status => ({
    ...status,
    _id: status._id.toString(),
  }));
};

// Get the total number of lead statuses
export const getLeadStatusesCount = async () => {
  await connectToDatabase();
  return await LeadStatus.countDocuments();
};
