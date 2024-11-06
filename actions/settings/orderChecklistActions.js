// @/actions/settings/orderChecklistActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import OrderChecklist from '@/lib/database/models/OrderChecklist.model';

// Get all order checklists
export const getOrderChecklists = async () => {
  await connectToDatabase();
  const checklists = await OrderChecklist.find({}).lean();
  return checklists.map(checklist => ({
    ...checklist,
    _id: checklist._id.toString(),
  }));
};

// Get a single order checklist by ID
export const getOrderChecklistById = async (id) => {
  await connectToDatabase();
  const checklist = await OrderChecklist.findById(id).lean();
  if (!checklist) {
    return { success: false, error: true, message: 'Order Checklist not found' };
  }
  return { ...checklist, _id: checklist._id.toString() };
};

// Create a new order checklist
export const createOrderChecklist = async (currentState, checklistData) => {
  await connectToDatabase();

  // Check if checklist_name is provided
  if (!checklistData.checklist_name) {
    return { success: false, error: true, message: 'Checklist Name is required' };
  }

  // Check for existing checklist with the same name
  const existingChecklist = await OrderChecklist.findOne({ checklist_name: checklistData.checklist_name });
  if (existingChecklist) {
    return { success: false, error: true, message: 'Checklist already exists' };
  }

  try {
    const newChecklist = new OrderChecklist(checklistData);
    const savedChecklist = await newChecklist.save();
    return {
      _id: savedChecklist._id.toString(),
      checklistName: savedChecklist.checklist_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create checklist' };
  }
};

// Update an existing order checklist
export const updateOrderChecklist = async (currentState, updateData) => {
  await connectToDatabase();
  const id = updateData.id;

  try {
    const updatedChecklist = await OrderChecklist.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedChecklist) {
      return { success: false, error: true, message: 'Checklist not found' };
    }
    return { success: true, checklist: updatedChecklist.toObject() };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update checklist' };
  }
};

// Delete an order checklist
export const deleteOrderChecklist = async (id) => {
  await connectToDatabase();
  try {
    const deletedChecklist = await OrderChecklist.findByIdAndDelete(id);
    if (!deletedChecklist) {
      return { success: false, error: true, message: 'Checklist not found' };
    }
    return { success: true, message: 'Checklist deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete checklist' };
  }
};
