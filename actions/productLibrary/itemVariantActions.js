// @/actions/productLibrary/itemVariantActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import ItemVariant from '@/lib/database/models/productLibrary/ItemVariant.model';
import ItemMaster from '@/lib/database/models/productLibrary/ItemMaster.model';

// Get all item variants
export const getItemVariants = async () => {
  await connectToDatabase();
  const itemVariants = await ItemVariant.find({}).populate('item_name', 'item_name').lean();
  return itemVariants.map(variant => ({
    ...variant,
    _id: variant._id.toString(),
    item_name: variant.item_name?.item_name || '', // Get item_name from reference
  }));
};

// Get a single item variant by ID
export const getItemVariantById = async (id) => {
  await connectToDatabase();
  const variant = await ItemVariant.findById(id).populate('item_name', 'item_name').lean();
  if (!variant) {
    return null;
  }
  return {
    ...variant,
    _id: variant._id.toString(),
    item_name: variant.item_name?._id.toString(), // Return ObjectId of item_name
  };
};

// Create a new item variant
export const createItemVariant = async (currentState, variantData) => {
  await connectToDatabase();

  // Find the ObjectId of the item_name from the ItemMaster model
  const item = await ItemMaster.findById(variantData.item_name);
  if (!item) {
    return { success: false, error: true, message: "Item name not found in ItemMaster." };
  }

  // Use the ObjectId in place of the item_name string
  const newItemVariant = new ItemVariant(variantData);
  const savedVariant = await newItemVariant.save();

  return { success: true, error: false, variant: savedVariant.toObject() };
};

// Update an existing item variant
export const updateItemVariant = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();

  const item = await ItemMaster.findById(updateData.item_name);
  if (!item) {
    return { success: false, error: true, message: "Item name not found in ItemMaster." };
  }

  const updatedVariant = await ItemVariant.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedVariant) {
    return { success: false, message: 'Item Variant not found' };
  }
  return { success: true, variant: updatedVariant.toObject() };
};

// Delete an item variant
export const deleteItemVariant = async (id) => {
  await connectToDatabase();
  const deletedVariant = await ItemVariant.findByIdAndDelete(id);
  if (!deletedVariant) {
    return { success: false, message: 'Item Variant not found' };
  }
  return { success: true, message: 'Item Variant deleted successfully' };
};

// Get list of active Item Masters for selection
export const getActiveItemMasters = async () => {
  await connectToDatabase();
  const items = await ItemMaster.find({ active_status: true }, 'item_name').lean();
  return items;
};
