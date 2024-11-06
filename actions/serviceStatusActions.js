// @/actions/settings/serviceStatusActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import ServiceStatus from '@/lib/database/models/ServiceStatus.model';

// Get all service statuses
export const getServiceStatuses = async () => {
  await connectToDatabase();
  const statuses = await ServiceStatus.find({}).lean();
  return statuses.map(status => ({
    ...status,
    _id: status._id.toString(),
  }));
};

// Get a single service status by ID
export const getServiceStatusById = async (id) => {
  await connectToDatabase();
  const status = await ServiceStatus.findById(id).lean();
  if (!status) {
    return { success: false, error: true, message: 'Service status not found' };
  }
  return { ...status, _id: status._id.toString() };
};

// Create a new service status
export const createServiceStatus = async (currentStatus, serviceStatusData) => {
  await connectToDatabase();

  // Check if status_name is provided
  if (!serviceStatusData.status_name) {
    return { success: false, error: true, message: 'Service Status Name is required' };
  }

  // Check for existing status with the same name
  const existingStatus = await ServiceStatus.findOne({ status_name: serviceStatusData.status_name });
  if (existingStatus) {
    return { success: false, error: true, message: 'Service Status already exists' };
  }

  try {
    const newServiceStatus = new ServiceStatus(serviceStatusData);
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

  // Check if service status exists
  const existingStatus = await ServiceStatus.findById(id);
  if (!existingStatus) {
    return { success: false, error: true, message: 'Service Status not found' };
  }

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
      return { success: false, error: true, message: 'Service Status not found' };
    }
    return { success: true, error: false, message: 'Service Status deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete service status.' };
  }
};
