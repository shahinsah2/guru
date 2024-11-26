

"use server";

import { connectToDatabase } from '@/lib/database';
import Service from '@/lib/database/models/operations/Service.model';

// Get all delivery challans
export const getService = async () => {
  await connectToDatabase();
  const challans = await Service.find({}).lean();
  return challans.map(challan => ({
    ...challan,
    _id: challan._id.toString(),
  }));
};

// Get a single delivery challan by ID
export const getServiceById = async (id) => {
  await connectToDatabase();
  const challan = await Service.findById(id);
  if (!challan) {
    return null;
  }
  return {
    ...challan.toObject(),
    _id: challan._id.toString(),
  };
};

// Create a new delivery challan
export const createService = async (currentState, challanData) => {
  await connectToDatabase();
  
  // Check if the dc_id already exists
  const existingChallan = await Service.findOne({ dc_id: challanData.dc_id });


  try {
    // Create a new instance of the Service model
    const newChallan = new Service(challanData);
    const savedChallan = await newChallan.save(); // Save the instance to the database

    return { success: true, error: false, challan: savedChallan.toObject() };
  } catch (error) {
    console.error("Error creating delivery challan:", error);
    return { success: false, error: true, message: "Error saving delivery challan." };
  }
};

// Update an existing delivery challan
export const updateService = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedChallan = await Service.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, challan: updatedChallan.toObject() };
};

// Delete a delivery challan
export const deleteService = async (id) => {
  await connectToDatabase();
  const deletedChallan = await Service.findByIdAndDelete(id);
  if (!deletedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, message: 'Delivery Challan deleted successfully' };
};
