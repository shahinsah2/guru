"use server";

import { connectToDatabase } from '@/lib/database';
import ServiceStatus from '@/lib/database/models/ServiceStatus.model';

// Create a new service status
export const createServiceStatus = async (currentStatus, statusData) => {
  await connectToDatabase();
  try {
    const newServiceStatus = new ServiceStatus(statusData);
    const savedServiceStatus = await newServiceStatus.save();

    return {
      _id: savedServiceStatus._id.toString(),
      statusName: savedServiceStatus.status_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create service status.' };
  }
};

// Update an existing service status
export const updateServiceStatus = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedServiceStatus = await ServiceStatus.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedServiceStatus._id.toString(),
      statusName: updatedServiceStatus.status_name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update service status.' };
  }
};

// Delete a service status
export const deleteServiceStatus = async (id) => {
  await connectToDatabase();
  try {
    const deletedServiceStatus = await ServiceStatus.findByIdAndDelete(id);
    if (!deletedServiceStatus) {
      return { success: false, error: true, message: 'Service status not found' };
    }
    return { success: true, error: false, message: 'Service status deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete service status.' };
  }
};

// Get all service statuses with optional pagination
export const getServiceStatuses = async () => {
  await connectToDatabase();
  const serviceStatuses = await ServiceStatus.find({})
    .lean();
  return serviceStatuses.map(status => ({
    ...status,
    _id: status._id.toString(),
  }));
};

// Get the total number of service statuses
export const getServiceStatusesCount = async () => {
  await connectToDatabase();
  return await ServiceStatus.countDocuments();
};
