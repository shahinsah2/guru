// @/actions/procurement/deliveryChallanActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Grn from '@/lib/database/models/operations/Grn.model';

// Get all delivery challans
export const getGrn = async () => {
  await connectToDatabase();
  const challans = await Grn.find({}).lean();
  return challans.map(challan => ({
    ...challan,
    _id: challan._id.toString(),
  }));
};

// Get a single delivery challan by ID
export const getGrnById = async (id) => {
  await connectToDatabase();
  const challan = await Grn.findById(id);
  if (!challan) {
    return null;
  }
  return {
    ...challan.toObject(),
    _id: challan._id.toString(),
  };
};

// Create a new delivery challan
 export const createGrn = async (currentState, challanData) => {

    // Check if the dc_id already exists
    const existingChallan = await Grn.findOne({ dc_id: challanData.dc_id });
  
  
    await connectToDatabase();
    const newChallan = new Grn(challanData);
    const savedChallan = await newChallan.save();
    return { success: true, error: false, challan: savedChallan.toObject() };
 };
  

// Update an existing delivery challan
export const updateGrn = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedChallan = await Grn.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, challan: updatedChallan.toObject() };
};

// Delete a delivery challan
export const deleteGrn = async (id) => {
  await connectToDatabase();
  const deletedChallan = await Grn.findByIdAndDelete(id);
  if (!deletedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, message: 'Delivery Challan deleted successfully' };
};
