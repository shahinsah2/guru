// @/actions/termsAndConditionsActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import TermsandConditions from '@/lib/database/models/TermsandConditions.model';

// Create a new terms and conditions
export const createTermsAndConditions = async (currentStatus, termsData) => {
  await connectToDatabase();
  try {
    const newTerms = new TermsandConditions(termsData);
    const savedTerms = await newTerms.save();

    return {
      _id: savedTerms._id.toString(),
      termsType: savedTerms.type,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create terms and conditions.' };
  }
};

// Update an existing terms and conditions
export const updateTermsAndConditions = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedTerms = await TermsandConditions.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedTerms._id.toString(),
      termsType: updatedTerms.type,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update terms and conditions.' };
  }
};

// Delete terms and conditions
export const deleteTermsAndConditions = async (id) => {
  await connectToDatabase();
  try {
    const deletedTerms = await TermsandConditions.findByIdAndDelete(id);
    if (!deletedTerms) {
      return { success: false, error: true, message: 'Terms and conditions not found' };
    }
    return { success: true, error: false, message: 'Terms and conditions deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete terms and conditions.' };
  }
};

// Get all terms and conditions
export const getAllTermsAndConditions = async () => {
  await connectToDatabase();
  const terms = await TermsandConditions.find({})
    .lean();
  return terms.map(term => ({
    ...term,
    _id: term._id.toString(),
  }));
};
