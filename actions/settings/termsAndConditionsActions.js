// @/actions/settings/termsAndConditionsActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import TermsandConditions from '@/lib/database/models/TermsandConditions.model';

// Fetch all terms and conditions
export const getTermsAndConditions = async () => {
  await connectToDatabase();
  const terms = await TermsandConditions.find({}).lean();
  return terms.map(term => ({
    ...term,
    _id: term._id.toString(),
  }));
};

// Fetch a single term by ID
export const getTermById = async (id) => {
  await connectToDatabase();
  const term = await TermsandConditions.findById(id).lean();
  if (!term) {
    return { success: false, error: true, message: 'Term not found' };
  }
  return { ...term, _id: term._id.toString() };
};

// Create a new term
export const createTerm = async (currentStatus, termData) => {
  await connectToDatabase();
  try {
    const newTerm = new TermsandConditions(termData);
    const savedTerm = await newTerm.save();
    return { success: true, term: savedTerm.toObject() };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create term' };
  }
};

// Update an existing term
export const updateTerm = async (currentStatus, updateData) => {
  await connectToDatabase();
  const id = updateData.id;
  try {
    const updatedTerm = await TermsandConditions.findByIdAndUpdate(id, updateData, { new: true });
    return { success: true, term: updatedTerm.toObject() };
  } catch (error) {
    return { success: false, error: true, message: 'Failed to update term' };
  }
};

// Delete a term
export const deleteTerm = async (id) => {
  await connectToDatabase();
  try {
    const deletedTerm = await TermsandConditions.findByIdAndDelete(id);
    if (!deletedTerm) {
      return { success: false, error: true, message: 'Term not found' };
    }
    return { success: true, message: 'Term deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: 'Failed to delete term' };
  }
};
