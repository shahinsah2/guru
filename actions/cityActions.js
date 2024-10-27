// @/actions/cityActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import City from '@/lib/database/models/City.model';

// Create a new city
export const createCity = async (currentStatus, cityData) => {
  await connectToDatabase();
  try {
    const newCity = new City(cityData);
    const savedCity = await newCity.save();

    return {
      _id: savedCity._id.toString(),
      cityName: savedCity.name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create city.' };
  }
};

// Update an existing city
export const updateCity = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedCity = await City.findByIdAndUpdate(id, updateData, { new: true })
      .populate('state country');
    return {
      _id: updatedCity._id.toString(),
      cityName: updatedCity.name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update city.' };
  }
};

// Delete a city
export const deleteCity = async (id) => {
  await connectToDatabase();
  try {
    const deletedCity = await City.findByIdAndDelete(id);
    if (!deletedCity) {
      return { success: false, error: true, message: 'City not found' };
    }
    return { success: true, error: false, message: 'City deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete city.' };
  }
};

// Get cities with optional pagination
export const getCities = async ({ skip = 0, limit = 10 } = {}) => {
  await connectToDatabase();
  const cities = await City.find({})
    .skip(skip)
    .limit(limit)
    .populate('state country')
    .lean();
  return cities.map(city => ({
    ...city,
    _id: city._id.toString(),
    state: city.state ? city.state.name : 'No State',
    country: city.country ? city.country.name : 'No Country',
  }));
};

// Get the total number of cities
export const getCitiesCount = async () => {
  await connectToDatabase();
  return await City.countDocuments();
};
