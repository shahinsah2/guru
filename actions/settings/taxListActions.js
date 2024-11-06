// @/actions/settings/taxListActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import TaxList from '@/lib/database/models/TaxList.model';

// Get all tax lists
export const getTaxLists = async () => {
  await connectToDatabase();
  const taxes = await TaxList.find({}).lean();
  return taxes.map(tax => ({
    ...tax,
    _id: tax._id.toString(),
  }));
};

// Get a single tax list by ID
export const getTaxListById = async (id) => {
  await connectToDatabase();
  const tax = await TaxList.findById(id).lean();
  if (!tax) {
    return { success: false, error: true, message: 'Tax list not found' };
  }
  return { ...tax, _id: tax._id.toString() };
};

// Create a new tax list
export const createTaxList = async (currentStatus, taxData) => {
  await connectToDatabase();

  if (!taxData.tax_name) {
    return { success: false, error: true, message: 'Tax Name is required' };
  }

  const existingTax = await TaxList.findOne({ tax_name: taxData.tax_name });
  if (existingTax) {
    return { success: false, error: true, message: 'Tax Name already exists' };
  }

  try {
    const newTax = new TaxList(taxData);
    const savedTax = await newTax.save();
    return { success: true, _id: savedTax._id.toString(), error: false };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create tax list.' };
  }
};

// Update an existing tax list
export const updateTaxList = async (currentStatus, updateData) => {
  await connectToDatabase();
  const id = updateData.id;

  const existingTax = await TaxList.findById(id);
  if (!existingTax) {
    return { success: false, error: true, message: 'Tax List not found' };
  }

  try {
    const updatedTax = await TaxList.findByIdAndUpdate(id, updateData, { new: true });
    return { success: true, _id: updatedTax._id.toString(), error: false };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update tax list.' };
  }
};

// Delete a tax list
export const deleteTaxList = async (id) => {
  await connectToDatabase();
  try {
    const deletedTax = await TaxList.findByIdAndDelete(id);
    if (!deletedTax) {
      return { success: false, error: true, message: 'Tax List not found' };
    }
    return { success: true, message: 'Tax List deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: 'Failed to delete tax list' };
  }
};
