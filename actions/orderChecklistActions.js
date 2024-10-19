// @/actions/orderChecklistActions.js

import { connectToDatabase } from '@/lib/database';
import OrderChecklist from '@/lib/database/models/OrderChecklist.model';

// Create a new checklist item
export const createOrderChecklist = async (checklistData) => {
  await connectToDatabase();

  const newChecklist = new OrderChecklist(checklistData);
  return await newChecklist.save();
};

// Retrieve a checklist item by ID
export const getOrderChecklistById = async (id) => {
  await connectToDatabase();
  const checklist = await OrderChecklist.findById(id);
  if (!checklist) {
    throw new Error('Checklist item not found');
  }
  return checklist;
};

// Retrieve all checklist items
export const getAllOrderChecklists = async () => {
  await connectToDatabase();
  return await OrderChecklist.find({});
};

// Update a checklist item
export const updateOrderChecklist = async (id, updateData) => {
  await connectToDatabase();

  const updatedChecklist = await OrderChecklist.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedChecklist) {
    throw new Error('Checklist item not found');
  }
  return updatedChecklist;
};

// Delete a checklist item
export const deleteOrderChecklist = async (id) => {
  await connectToDatabase();

  const deletedChecklist = await OrderChecklist.findByIdAndDelete(id);
  if (!deletedChecklist) {
    throw new Error('Checklist item not found');
  }
  return deletedChecklist;
};
