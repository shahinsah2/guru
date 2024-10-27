// @/actions/orderChecklistActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import OrderChecklist from '@/lib/database/models/OrderChecklist.model';

// Create a new order checklist
export const createOrderChecklist = async (currentStatus, checklistData) => {
  await connectToDatabase();
  try {
    const newChecklist = new OrderChecklist(checklistData);
    const savedChecklist = await newChecklist.save();

    return {
      _id: savedChecklist._id.toString(),
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create order checklist.' };
  }
};

// Update an existing order checklist
export const updateOrderChecklist = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedChecklist = await OrderChecklist.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedChecklist._id.toString(),
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update order checklist.' };
  }
};

// Delete an order checklist
export const deleteOrderChecklist = async (id) => {
  await connectToDatabase();
  try {
    const deletedChecklist = await OrderChecklist.findByIdAndDelete(id);
    if (!deletedChecklist) {
      return { success: false, error: true, message: 'Order checklist not found' };
    }
    return { success: true, error: false, message: 'Order checklist deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete order checklist.' };
  }
};

// Get order checklists with optional pagination
export const getOrderChecklists = async () => {
  await connectToDatabase();
  const checklists = await OrderChecklist.find({})
    .lean();
  return checklists.map(checklist => ({
    ...checklist,
    _id: checklist._id.toString(),
  }));
};

// Get the total number of order checklists
export const getOrderChecklistsCount = async () => {
  await connectToDatabase();
  return await OrderChecklist.countDocuments();
};
