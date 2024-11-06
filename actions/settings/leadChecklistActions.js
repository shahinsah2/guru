// @/actions/settings/leadChecklistActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import LeadChecklist from '@/lib/database/models/LeadChecklist.model';

// Get all lead checklists
export const getLeadChecklists = async () => {
  await connectToDatabase();
  const checklists = await LeadChecklist.find({}).lean();
  return checklists.map(checklist => ({
    ...checklist,
    _id: checklist._id.toString(),
  }));
};

// Get a single lead checklist by ID
export const getLeadChecklistById = async (id) => {
  await connectToDatabase();
  const checklist = await LeadChecklist.findById(id).lean();
  if (!checklist) {
    return { success: false, error: true, message: 'Lead Checklist not found' };
  }
  return { ...checklist, _id: checklist._id.toString() };
};

// Create a new lead checklist
export const createLeadChecklist = async (currentStatus, checklistData) => {
  await connectToDatabase();

  try {
    const newChecklist = new LeadChecklist(checklistData);
    const savedChecklist = await newChecklist.save();
    return {
      _id: savedChecklist._id.toString(),
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
    if (!updatedChecklist) {
      return { success: false, error: true, message: 'Lead Checklist not found' };
    }
    return { success: true, error: false };
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
      return { success: false, error: true, message: 'Lead Checklist not found' };
    }
    return { success: true, message: 'Lead Checklist deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete lead checklist.' };
  }
};
