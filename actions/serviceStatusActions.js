// @/actions/serviceStatusActions.js

import { connectToDatabase } from '@/lib/database';
import ServiceStatus from '@/lib/database/models/ServiceStatus.model';

// Create a new service status
export const createServiceStatus = async (statusData) => {
  await connectToDatabase();

  const newStatus = new ServiceStatus(statusData);
  return await newStatus.save();
};

// Retrieve a service status by ID
export const getServiceStatusById = async (id) => {
  await connectToDatabase();
  const status = await ServiceStatus.findById(id);
  if (!status) {
    throw new Error('Service status not found');
  }
  return status;
};

// Retrieve all service statuses
export const getAllServiceStatuses = async () => {
  await connectToDatabase();
  return await ServiceStatus.find({});
};

// Update a service status
export const updateServiceStatus = async (id, updateData) => {
  await connectToDatabase();

  const updatedStatus = await ServiceStatus.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedStatus) {
    throw new Error('Service status not found');
  }
  return updatedStatus;
};

// Delete a service status
export const deleteServiceStatus = async (id) => {
  await connectToDatabase();

  const deletedStatus = await ServiceStatus.findByIdAndDelete(id);
  if (!deletedStatus) {
    throw new Error('Service status not found');
  }
  return deletedStatus;
};
