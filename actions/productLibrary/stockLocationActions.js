// @/actions/productLibrary/stockLocationActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import StockLocation from '@/lib/database/models/productLibrary/StockLocation.model';

// Get all stock locations
export const getStockLocations = async () => {
  await connectToDatabase();
  const stockLocations = await StockLocation.find({}).lean();
  return stockLocations.map(location => ({
    ...location,
    _id: location._id.toString(),
  }));
};

// Get a single stock location by ID
export const getStockLocationById = async (id) => {
  await connectToDatabase();
  const location = await StockLocation.findById(id);
  if (!location) {
    return null;
  }
  return {
    ...location.toObject(),
    _id: location._id.toString(),
  };
};

// Create a new stock location
export const createStockLocation = async (currentState, locationData) => {

  console.log(locationData)

   // Check if the stock_location_id already exists
   const existingLocation = await StockLocation.findOne({ stock_location_id: locationData.stock_location_id });
   if (existingLocation) {
     return { success: false, error:true,  message: 'Stock Location ID already exists' };
   }

  await connectToDatabase();
  const newLocation = new StockLocation(locationData);
  const savedLocation = await newLocation.save();
  return { success: true, error: false, location: savedLocation.toObject() };
};

// Update an existing stock location
export const updateStockLocation = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedLocation = await StockLocation.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedLocation) {
    return { success: false, message: 'Stock Location not found' };
  }
  return { success: true, location: updatedLocation.toObject() };
};

// Delete a stock location
export const deleteStockLocation = async (id) => {
  await connectToDatabase();
  const deletedLocation = await StockLocation.findByIdAndDelete(id);
  if (!deletedLocation) {
    return { success: false, message: 'Stock Location not found' };
  }
  return { success: true, message: 'Stock Location deleted successfully' };
};
