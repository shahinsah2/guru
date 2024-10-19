// @/actions/leadStatusActions.js

import { connectToDatabase } from '@/lib/database';
import LeadStatus from '@/lib/database/models/LeadStatus.model';

// Create a new lead status
export const createLeadStatus = async (statusData) => {
  await connectToDatabase();

  const newStatus = new LeadStatus(statusData);
  return await newStatus.save();
};

// Retrieve a lead status by ID
export const getLeadStatusById = async (id) => {
  await connectToDatabase();
  const status = await LeadStatus.findById(id);
  if (!status) {
    throw new Error('Lead status not found');
  }
  return status;
};

// Retrieve all lead statuses
export const getAllLeadStatuses = async () => {
  await connectToDatabase();
  return await LeadStatus.find({});
};

// Update a lead status
export const updateLeadStatus = async (id, updateData) => {
  await connectToDatabase();

  const updatedStatus = await LeadStatus.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedStatus) {
    throw new Error('Lead status not found');
  }
  return updatedStatus;
};

// Delete a lead status
export const deleteLeadStatus = async (id) => {
  await connectToDatabase();

  const deletedStatus = await LeadStatus.findByIdAndDelete(id);
  if (!deletedStatus) {
    throw new Error('Lead status not found');
  }
  return deletedStatus;
};
