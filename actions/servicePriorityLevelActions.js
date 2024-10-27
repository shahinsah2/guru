"use server";

import { connectToDatabase } from "@/lib/database";
import ServicePriorityLevel from "@/lib/database/models/ServicePriorityLevel.model";

// Create a new Service Priority Level
export const createServicePriorityLevel = async (currentStatus, priorityLevelData) => {
  await connectToDatabase();
  try {
    const newPriorityLevel = new ServicePriorityLevel(priorityLevelData);
    const savedPriorityLevel = await newPriorityLevel.save();

    return {
      _id: savedPriorityLevel._id.toString(),
      priorityLevel: savedPriorityLevel.priority_level,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create service priority level.' };
  }
};

// Update an existing Service Priority Level
export const updateServicePriorityLevel = async (currentStatus, updateData) => {
  await connectToDatabase();
  const id = updateData.id;
  try {
    const updatedPriorityLevel = await ServicePriorityLevel.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedPriorityLevel._id.toString(),
      priorityLevel: updatedPriorityLevel.priority_level,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update service priority level.' };
  }
};

// Delete a Service Priority Level
export const deleteServicePriorityLevel = async (id) => {
  await connectToDatabase();
  try {
    const deletedPriorityLevel = await ServicePriorityLevel.findByIdAndDelete(id);
    if (!deletedPriorityLevel) {
      return { success: false, error: true, message: 'Service priority level not found' };
    }
    return { success: true, error: false, message: 'Service priority level deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete service priority level.' };
  }
};

// Get service priority levels with optional pagination
export const getServicePriorityLevels = async () => {
  await connectToDatabase();
  const priorityLevels = await ServicePriorityLevel.find({})
    .lean();
  return priorityLevels.map(priorityLevel => ({
    ...priorityLevel,
    _id: priorityLevel._id.toString(),
  }));
};

// Get the total number of service priority levels
export const getServicePriorityLevelsCount = async () => {
  await connectToDatabase();
  return await ServicePriorityLevel.countDocuments();
};
