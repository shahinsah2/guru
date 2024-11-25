// @/actions/procurement/deliveryChallanActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import DeliveryChallan from '@/lib/database/models/operations/Delivery_challan.model';

// Get all delivery challans
export const getDeliveryChallans = async () => {
  await connectToDatabase();
  const challans = await DeliveryChallan.find({}).lean();
  return challans.map(challan => ({
    ...challan,
    _id: challan._id.toString(),
  }));
};

// Get a single delivery challan by ID
export const getDeliveryChallanById = async (id) => {
  await connectToDatabase();
  const challan = await DeliveryChallan.findById(id);
  if (!challan) {
    return null;
  }
  return {
    ...challan.toObject(),
    _id: challan._id.toString(),
  };
};

// Create a new delivery challan
export const createDeliveryChallan = async (currentState, challanData) => {

  // Check if the dc_id already exists
  const existingChallan = await DeliveryChallan.findOne({ dc_id: challanData.dc_id });

  await connectToDatabase();
  const newChallan = new DeliveryChallan(challanData);
  const savedChallan = await newChallan.save();
  return { success: true, error: false, challan: savedChallan.toObject() };
};

// Update an existing delivery challan
export const updateDeliveryChallan = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedChallan = await DeliveryChallan.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, challan: updatedChallan.toObject() };
};

// Delete a delivery challan
export const deleteDeliveryChallan = async (id) => {
  await connectToDatabase();
  const deletedChallan = await DeliveryChallan.findByIdAndDelete(id);
  if (!deletedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, message: 'Delivery Challan deleted successfully' };
};
