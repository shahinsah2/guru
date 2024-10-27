// @/actions/taxListActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import TaxList from '@/lib/database/models/TaxList.model';

// Create a new tax
export const createTaxList = async (currentStatus, taxData) => {
  await connectToDatabase();
  try {
    const newTax = new TaxList(taxData);
    const savedTax = await newTax.save();

    return {
      _id: savedTax._id.toString(),
      taxName: savedTax.tax_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create tax.' };
  }
};

// Update an existing tax
export const updateTaxList = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedTax = await TaxList.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedTax._id.toString(),
      taxName: updatedTax.tax_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update tax.' };
  }
};

// Delete a tax
export const deleteTaxList = async (id) => {
  await connectToDatabase();
  try {
    const deletedTax = await TaxList.findByIdAndDelete(id);
    if (!deletedTax) {
      return { success: false, error: true, message: 'Tax not found' };
    }
    return { success: true, error: false, message: 'Tax deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete tax.' };
  }
};

// Get all tax lists
export const getTaxLists = async () => {
  await connectToDatabase();
  const taxes = await TaxList.find({})
    .lean();
  return taxes.map(tax => ({
    ...tax,
    _id: tax._id.toString(),
  }));
};
