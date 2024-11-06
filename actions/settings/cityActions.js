// @/actions/settings/cityActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import City from '@/lib/database/models/City.model';

// Get all cities
export const getCities = async () => {
  await connectToDatabase();
  const cities = await City.find({}).populate('state country').lean();
  return cities.map(city => ({
    ...city,
    _id: city._id.toString(),
    state: city.state ? city.state._id.toString() : null,
    country: city.country ? city.country._id.toString() : null,
  }));
};

// Get a single city by ID
export const getCityById = async (id) => {
  await connectToDatabase();
  const city = await City.findById(id).populate('state country').lean();
  return city ? { ...city, _id: city._id.toString(), state: city.state?._id.toString(), country: city.country?._id.toString() } : null;
};

// Create a new city with duplicate check
export const createCity = async (currentState, cityData) => {
  await connectToDatabase();

  // Check if the city name already exists in the specified state and country
  const existingCity = await City.findOne({ name: cityData.name, state: cityData.state, country: cityData.country });
  if (existingCity) {
    return { success: false, error:true, message: "A city with this name already exists in the selected state and country." };
  }

  try {
    const newCity = new City(cityData);
    const savedCity = await newCity.save();
    return { success: true, city: savedCity.toObject() };
  } catch (error) {
    return { success: false, error:true, message: "Failed to create city. Please try again." };
  }
};

// Update an existing city with duplicate check
export const updateCity = async (currentState, updateData) => {
  const { id, name, state, country } = updateData;
  await connectToDatabase();

  // Check if another city with the same name exists in the same state and country
  const existingCity = await City.findOne({ name, state, country, _id: { $ne: id } });
  if (existingCity) {
    return { success: false, error:true, message: "A city with this name already exists in the selected state and country." };
  }

  try {
    const updatedCity = await City.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCity) {
      return { success: false, error:true, message: "City not found" };
    }
    return { success: true, city: updatedCity.toObject() };
  } catch (error) {
    return { success: false, error:true, message: "Failed to update city. Please try again." };
  }
};

// Delete a city
export const deleteCity = async (id) => {
  await connectToDatabase();
  const deletedCity = await City.findByIdAndDelete(id);
  if (!deletedCity) {
    return { success: false, error:true, message: 'City not found' };
  }
  return { success: true, message: 'City deleted successfully' };
};
