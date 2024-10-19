// @/actions/stateActions.js

import { connectToDatabase } from '@/lib/database';
import State from '@/lib/database/models/State.model';
import Country from '@/lib/database/models/Country.model';

// Create a new state
export const createState = async (stateData) => {
  await connectToDatabase();

  // Verify that the country exists
  const countryExists = await Country.findById(stateData.country);
  if (!countryExists) {
    throw new Error('Country not found');
  }

  const newState = new State(stateData);
  return await newState.save();
};

// Retrieve a state by ID
export const getStateById = async (id) => {
  await connectToDatabase();
  const state = await State.findById(id).populate('country');
  if (!state) {
    throw new Error('State not found');
  }
  return state;
};

// Retrieve all states
export const getAllStates = async () => {
  await connectToDatabase();
  return await State.find({}).populate('country');
};

// Update a state
export const updateState = async (id, updateData) => {
  await connectToDatabase();

  // Check if the country exists if it's being updated
  if (updateData.country) {
    const countryExists = await Country.findById(updateData.country);
    if (!countryExists) {
      throw new Error('Country not found');
    }
  }

  const updatedState = await State.findByIdAndUpdate(id, updateData, { new: true }).populate('country');
  if (!updatedState) {
    throw new Error('State not found');
  }
  return updatedState;
};

// Delete a state
export const deleteState = async (id) => {
  await connectToDatabase();
  const deletedState = await State.findByIdAndDelete(id);
  if (!deletedState) {
    throw new Error('State not found');
  }
  return deletedState;
};
