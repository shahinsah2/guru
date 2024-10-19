// @/actions/locationActions.js

import { connectToDatabase } from '@/lib/database';
import Location from '@/lib/database/models/Location.model';
import Country from '@/lib/database/models/Country.model';
import State from '@/lib/database/models/State.model';
import City from '@/lib/database/models/City.model';

// Create a new location
export const createLocation = async (locationData) => {
  await connectToDatabase();

  // Verify the country, state, and city if they exist
  const countryExists = await Country.findById(locationData.country);
  if (!countryExists) {
    throw new Error('Country not found');
  }

  if (locationData.state) {
    const stateExists = await State.findById(locationData.state);
    if (!stateExists) {
      throw new Error('State not found');
    }
  }

  if (locationData.city) {
    const cityExists = await City.findById(locationData.city);
    if (!cityExists) {
      throw new Error('City not found');
    }
  }

  const newLocation = new Location(locationData);
  return await newLocation.save();
};

// Retrieve a location by ID
export const getLocationById = async (id) => {
  await connectToDatabase();
  const location = await Location.findById(id).populate('country').populate('state').populate('city');
  if (!location) {
    throw new Error('Location not found');
  }
  return location;
};

// Retrieve all locations
export const getAllLocations = async () => {
  await connectToDatabase();
  return await Location.find({}).populate('country').populate('state').populate('city');
};

// Update a location
export const updateLocation = async (id, updateData) => {
  await connectToDatabase();

  // Check for the existence of the referenced documents if updating
  if (updateData.country) {
    const countryExists = await Country.findById(updateData.country);
    if (!countryExists) {
      throw new Error('Country not found');
    }
  }

  if (updateData.state) {
    const stateExists = await State.findById(updateData.state);
    if (!stateExists) {
      throw new Error('State not found');
    }
  }

  if (updateData.city) {
    const cityExists = await City.findById(updateData.city);
    if (!cityExists) {
      throw new Error('City not found');
    }
  }

  const updatedLocation = await Location.findByIdAndUpdate(id, updateData, { new: true }).populate('country').populate('state').populate('city');
  if (!updatedLocation) {
    throw new Error('Location not found');
  }
  return updatedLocation;
};

// Delete a location
export const deleteLocation = async (id) => {
  await connectToDatabase();
  const deletedLocation = await Location.findByIdAndDelete(id);
  if (!deletedLocation) {
    throw new Error('Location not found');
  }
  return deletedLocation;
};
