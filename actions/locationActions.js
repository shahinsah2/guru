// @/actions/locationActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Location from '@/lib/database/models/Location.model';
import Country from '@/lib/database/models/Country.model';
import State from '@/lib/database/models/State.model';
import City from '@/lib/database/models/City.model';

// Create a new location
export const createLocation = async (currentStatus, locationData) => {
  await connectToDatabase();
  try {
    const newLocation = new Location(locationData);
    const savedLocation = await newLocation.save();

    return {
      _id: savedLocation._id.toString(),
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create location.' };
  }
};

// Update an existing location
export const updateLocation = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedLocation = await Location.findByIdAndUpdate(id, updateData, { new: true })
      .populate('country')
      .populate('state')
      .populate('city');
    return {
      _id: updatedLocation._id.toString(),
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update location.' };
  }
};

// Delete a location
export const deleteLocation = async (id) => {
  await connectToDatabase();
  try {
    const deletedLocation = await Location.findByIdAndDelete(id);
    if (!deletedLocation) {
      return { success: false, error: true, message: 'Location not found' };
    }
    return { success: true, error: false, message: 'Location deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete location.' };
  }
};

// Get locations with optional pagination
export const getLocations = async () => {
  await connectToDatabase();
  const locations = await Location.find({})    
    .populate('country')
    .populate('state')
    .populate('city')
    .lean();
  return locations.map(location => ({
    ...location,
    _id: location._id.toString(),
    country: location.country ? location.country.name : 'No Country',
    state: location.state ? location.state.name : 'No State',
    city: location.city ? location.city.name : 'No City',
  }));
};

// Get the total number of locations
export const getLocationsCount = async () => {
  await connectToDatabase();
  return await Location.countDocuments();
};
