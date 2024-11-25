// @/actions/procurement/deliveryChallanActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Invoice from '@/lib/database/models/operations/Invoice.model';
import { FaFileInvoiceDollar } from 'react-icons/fa';

// Get all delivery challans
export const getInvoice = async () => {
  await connectToDatabase();
  const challans = await Invoice.find({}).lean();
  return challans.map(challan => ({
    ...challan,
    _id: challan._id.toString(),
  }));
};

// Get a single delivery challan by ID
export const getInvoiceById = async (id) => {
  await connectToDatabase();
  const challan = await Invoice.findById(id);
  if (!challan) {
    return null;
  }
  return {
    ...challan.toObject(),
    _id: challan._id.toString(),
  };
};

// Create a new delivery challan
// Create a new delivery challan
export const createInvoice = async (currentState, challanData) => {
    await connectToDatabase();
  
    // Check if the dc_id already exists
    const existingChallan = await Invoice.findOne({ dc_id: challanData.dc_id });
 
  
    try {
      // Create a new instance of the Invoice model
      const newChallan = new Invoice(challanData);
      const savedChallan = await newChallan.save(); // Save the instance to the database
  
      return { success: true, error: false, challan: savedChallan.toObject() };
    } catch (error) {
      console.error("Error creating delivery challan:", error);
      return { success: false, error: true, message: "Error saving delivery challan." };
    }
  };
  

// Update an existing delivery challan
export const updateInvoice = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedChallan = await Invoice.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, challan: updatedChallan.toObject() };
};

// Delete a delivery challan
export const deleteInvoice = async (id) => {
  await connectToDatabase();
  const deletedChallan = await Invoice.findByIdAndDelete(id);
  if (!deletedChallan) {
    return { success: false, message: 'Delivery Challan not found' };
  }
  return { success: true, message: 'Delivery Challan deleted successfully' };
};
