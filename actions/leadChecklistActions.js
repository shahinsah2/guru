// @/actions/leadChecklistActions.js

import { connectToDatabase } from '@/lib/database';
import LeadChecklist from '@/lib/database/models/LeadChecklist.model';

// Create a new lead checklist item
export const createLeadChecklist = async (checklistData) => {
  await connectToDatabase();

  const newChecklist = new LeadChecklist(checklistData);
  return await newChecklist.save();
};

// Retrieve a lead checklist item by ID
export const getLeadChecklistById = async (id) => {
  await connectToDatabase();
  const checklist = await LeadChecklist.findById(id);
  if (!checklist) {
    throw new Error('Checklist item not found');
  }
  return checklist;
};

// Retrieve all lead checklist items
export const getAllLeadChecklists = async () => {
  await connectToDatabase();
  return await LeadChecklist.find({});
};

// Update a lead checklist item
export const updateLeadChecklist = async (id, updateData) => {
  await connectToDatabase();

  const updatedChecklist = await LeadChecklist.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedChecklist) {
    throw new Error('Checklist item not found');
  }
  return updatedChecklist;
};

// Delete a lead checklist item
export const deleteLeadChecklist = async (id) => {
  await connectToDatabase();

  const deletedChecklist = await LeadChecklist.findByIdAndDelete(id);
  if (!deletedChecklist) {
    throw new Error('Checklist item not found');
  }
  return deletedChecklist;
};
