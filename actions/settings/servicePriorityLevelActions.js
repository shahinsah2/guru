// @/actions/settings/servicePriorityLevelActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import ServicePriorityLevel from '@/lib/database/models/ServicePriorityLevel.model';

// Create a new service priority level
export const createServicePriorityLevel = async (currentStatus, levelData) => {
  await connectToDatabase();
  try {
    const existingLevel = await ServicePriorityLevel.findOne({ priority_level: levelData.priority_level });
    if (existingLevel) {
      return { success: false, error: true, message: "Priority level already exists" };
    }

    const newLevel = new ServicePriorityLevel(levelData);
    const savedLevel = await newLevel.save();

    return {
      _id: savedLevel._id.toString(),
      priorityLevel: savedLevel.priority_level,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create priority level.' };
  }
};

// Update an existing service priority level
export const updateServicePriorityLevel = async (currentStatus, updateData) => {
  await connectToDatabase();
  const id = updateData.id;

  try {
    const updatedLevel = await ServicePriorityLevel.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedLevel._id.toString(),
      priorityLevel: updatedLevel.priority_level,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update priority level.' };
  }
};

// Delete a service priority level
export const deleteServicePriorityLevel = async (id) => {
  await connectToDatabase();
  try {
    const deletedLevel = await ServicePriorityLevel.findByIdAndDelete(id);
    if (!deletedLevel) {
      return { success: false, error: true, message: 'Priority level not found' };
    }
    return { success: true, error: false, message: 'Priority level deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete priority level.' };
  }
};

// Get all service priority levels
export const getServicePriorityLevels = async () => {
  await connectToDatabase();
  const levels = await ServicePriorityLevel.find({}).lean();
  return levels.map(level => ({
    ...level,
    _id: level._id.toString(),
  }));
};

// Get a single service priority level by ID
export const getServicePriorityLevelById = async (id) => {
  await connectToDatabase();
  const level = await ServicePriorityLevel.findById(id).lean();
  if (!level) {
    return { success: false, error: true, message: 'Priority level not found' };
  }
  return { ...level, _id: level._id.toString() };
};
