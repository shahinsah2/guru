// @/actions/servicePriorityLevelActions.js

import { connectToDatabase } from '@/lib/database';
import ServicePriorityLevel from '@/lib/database/models/ServicePriorityLevel.model';

// Create a new service priority level
export const createServicePriorityLevel = async (priorityData) => {
  await connectToDatabase();

  const newPriorityLevel = new ServicePriorityLevel(priorityData);
  return await newPriorityLevel.save();
};

// Retrieve a service priority level by ID
export const getServicePriorityLevelById = async (id) => {
  await connectToDatabase();
  const priorityLevel = await ServicePriorityLevel.findById(id);
  if (!priorityLevel) {
    throw new Error('Service priority level not found');
  }
  return priorityLevel;
};

// Retrieve all service priority levels
export const getAllServicePriorityLevels = async () => {
  await connectToDatabase();
  return await ServicePriorityLevel.find({});
};

// Update a service priority level
export const updateServicePriorityLevel = async (id, updateData) => {
  await connectToDatabase();

  const updatedPriorityLevel = await ServicePriorityLevel.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedPriorityLevel) {
    throw new Error('Service priority level not found');
  }
  return updatedPriorityLevel;
};

// Delete a service priority level
export const deleteServicePriorityLevel = async (id) => {
  await connectToDatabase();

  const deletedPriorityLevel = await ServicePriorityLevel.findByIdAndDelete(id);
  if (!deletedPriorityLevel) {
    throw new Error('Service priority level not found');
  }
  return deletedPriorityLevel;
};
