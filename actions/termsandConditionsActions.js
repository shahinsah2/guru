// @/actions/termsandConditionsActions.js

import { connectToDatabase } from '@/lib/database';
import TermsandConditions from '@/lib/database/models/TermsandConditions.model';

// Create a new Terms and Conditions
export const createTermsAndConditions = async (termsData) => {
  await connectToDatabase();
  
  const newTerms = new TermsandConditions(termsData);
  return await newTerms.save();
};

// Retrieve Terms and Conditions by ID
export const getTermsAndConditionsById = async (id) => {
  await connectToDatabase();
  const terms = await TermsandConditions.findById(id);
  if (!terms) {
    throw new Error('Terms and Conditions not found');
  }
  return terms;
};

// Retrieve all Terms and Conditions
export const getAllTermsAndConditions = async () => {
  await connectToDatabase();
  return await TermsandConditions.find({});
};

// Update Terms and Conditions
export const updateTermsAndConditions = async (id, updateData) => {
  await connectToDatabase();

  const updatedTerms = await TermsandConditions.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedTerms) {
    throw new Error('Terms and Conditions not found');
  }
  return updatedTerms;
};

// Delete Terms and Conditions
export const deleteTermsAndConditions = async (id) => {
  await connectToDatabase();
  
  const deletedTerms = await TermsandConditions.findByIdAndDelete(id);
  if (!deletedTerms) {
    throw new Error('Terms and Conditions not found');
  }
  return deletedTerms;
};
