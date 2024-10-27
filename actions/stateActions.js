// @/actions/stateActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import State from '@/lib/database/models/State.model';

// Create a new state
export const createState = async (currentStatus, stateData) => {
  await connectToDatabase();
  try {
    const newState = new State(stateData);
    const savedState = await newState.save();

    return {
      _id: savedState._id.toString(),
      stateName: savedState.name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create state.' };
  }
};

// Update an existing state
export const updateState = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedState = await State.findByIdAndUpdate(id, updateData, { new: true })
      .populate('country'); // Populate country if needed
    return {
      _id: updatedState._id.toString(),
      stateName: updatedState.name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update state.' };
  }
};

// Delete a state
export const deleteState = async (id) => {
  await connectToDatabase();
  try {
    const deletedState = await State.findByIdAndDelete(id);
    if (!deletedState) {
      return { success: false, error: true, message: 'State not found' };
    }
    return { success: true, error: false, message: 'State deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete state.' };
  }
};

// Get all states without pagination
export const getStates = async () => {
  await connectToDatabase();
  const states = await State.find({}).populate('country').lean();
  return states.map(state => ({
    ...state,
    _id: state._id.toString(),
    country: state.country ? state.country.name : 'No Country', // Handle case where country might be null
  }));
};

// Get the total number of states
export const getStatesCount = async () => {
  await connectToDatabase();
  return await State.countDocuments();
};
