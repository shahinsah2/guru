// @/actions/productLibrary/itemMasterActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import ItemMaster from '@/lib/database/models/productLibrary/ItemMaster.model';

// Get all items
export const getItemMasters = async () => {
  await connectToDatabase();
  const items = await ItemMaster.find({}).lean();
  return items.map(item => ({
    ...item,
    _id: item._id.toString(),
  }));
};

// Get a single item by ID
export const getItemMasterById = async (id) => {
  await connectToDatabase();
  const item = await ItemMaster.findById(id);
  if (!item) {
    return null;
  }
  return {
    ...item.toObject(),
    _id: item._id.toString(),
  };
};

// Create a new item
export const createItemMaster = async (currentState, itemData) => {
  await connectToDatabase();

  // Check if the item_name already exists
  const existingItem = await ItemMaster.findOne({ item_name: itemData.item_name });
  if (existingItem) {
    return { success: false, error: true, message: 'Item Name already exists' };
  }

  const newItem = new ItemMaster(itemData);
  const savedItem = await newItem.save();
  return { success: true, error: false, item: savedItem.toObject() };
};

// Update an existing item
export const updateItemMaster = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedItem = await ItemMaster.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedItem) {
    return { success: false, message: 'Item not found' };
  }
  return { success: true, item: updatedItem.toObject() };
};

// Delete an item
export const deleteItemMaster = async (id) => {
  await connectToDatabase();
  const deletedItem = await ItemMaster.findByIdAndDelete(id);
  if (!deletedItem) {
    return { success: false, message: 'Item not found' };
  }
  return { success: true, message: 'Item deleted successfully' };
};
