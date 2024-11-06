// @/actions/settings/stateActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import State from '@/lib/database/models/State.model';

// Get all states
export const getStates = async () => {
  await connectToDatabase();
  const states = await State.find({}).populate('country').lean();
  return states.map(state => ({
    ...state,
    _id: state._id.toString(),
    country: state.country ? state.country._id.toString() : null,
  }));
};

// Get a single state by ID
export const getStateById = async (id) => {
  await connectToDatabase();
  const state = await State.findById(id).populate('country').lean();
  return state ? { ...state, _id: state._id.toString(), country: state.country?._id.toString() } : null;
};

// Create a new state with duplicate check
export const createState = async (currentState, stateData) => {
  await connectToDatabase();

  // Check if the state name already exists in the specified country
  const existingState = await State.findOne({ name: stateData.name, country: stateData.country });
  if (existingState) {
    return { success: false, error: true, message: "A state with this name already exists in the selected country." };
  }

  try {
    const newState = new State(stateData);
    const savedState = await newState.save();
    return { success: true, state: savedState.toObject() };
  } catch (error) {
    return { success: false, error:true, message: "Failed to create state. Please try again." };
  }
};

// Update an existing state with duplicate check
export const updateState = async (currentState, updateData) => {
  const { id, name, country } = updateData;
  await connectToDatabase();

  // Check if another state with the same name exists in the same country
  const existingState = await State.findOne({ name, country, _id: { $ne: id } });
  if (existingState) {
    return { success: false, message: "A state with this name already exists in the selected country." };
  }

  try {
    const updatedState = await State.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedState) {
      return { success: false, message: "State not found" };
    }
    return { success: true, state: updatedState.toObject() };
  } catch (error) {
    return { success: false, message: "Failed to update state. Please try again." };
  }
};

// Delete a state
export const deleteState = async (id) => {
  await connectToDatabase();
  const deletedState = await State.findByIdAndDelete(id);
  if (!deletedState) {
    return { success: false, message: 'State not found' };
  }
  return { success: true, message: 'State deleted successfully' };
};
