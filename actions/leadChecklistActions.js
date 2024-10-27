// @/actions/leadChecklistActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import LeadChecklist from '@/lib/database/models/LeadChecklist.model';

// Create a new lead checklist
export const createLeadChecklist = async (currentStatus, checklistData) => {
  await connectToDatabase();
  try {
    const newChecklist = new LeadChecklist(checklistData);
    const savedChecklist = await newChecklist.save();

    return {
      _id: savedChecklist._id.toString(),
      checklistName: savedChecklist.checklist_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create lead checklist.' };
  }
};

// Update an existing lead checklist
export const updateLeadChecklist = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedChecklist = await LeadChecklist.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedChecklist._id.toString(),
      checklistName: updatedChecklist.checklist_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update lead checklist.' };
  }
};

// Delete a lead checklist
export const deleteLeadChecklist = async (id) => {
  await connectToDatabase();
  try {
    const deletedChecklist = await LeadChecklist.findByIdAndDelete(id);
    if (!deletedChecklist) {
      return { success: false, error: true, message: 'Lead checklist not found' };
    }
    return { success: true, error: false, message: 'Lead checklist deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete lead checklist.' };
  }
};

// Get lead checklists with optional pagination
export const getLeadChecklists = async ({ skip = 0, limit = 10 } = {}) => {
  await connectToDatabase();
  const checklists = await LeadChecklist.find({})
    .skip(skip)
    .limit(limit)
    .lean();
  return checklists.map(checklist => ({
    ...checklist,
    _id: checklist._id.toString(),
  }));
};

// Get the total number of lead checklists
export const getLeadChecklistsCount = async () => {
  await connectToDatabase();
  return await LeadChecklist.countDocuments();
};
