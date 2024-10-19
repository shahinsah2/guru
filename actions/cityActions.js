// @/actions/cityActions.js

import { connectToDatabase } from '@/lib/database';
import City from '@/lib/database/models/City.model';
import State from '@/lib/database/models/State.model';
import Country from '@/lib/database/models/Country.model';

// Create a new city
export const createCity = async (cityData) => {
  await connectToDatabase();

  // Verify that the state and country exist
  const stateExists = await State.findById(cityData.state);
  if (!stateExists) {
    throw new Error('State not found');
  }
  const countryExists = await Country.findById(cityData.country);
  if (!countryExists) {
    throw new Error('Country not found');
  }

  const newCity = new City(cityData);
  return await newCity.save();
};

// Retrieve a city by ID
export const getCityById = async (id) => {
  await connectToDatabase();
  const city = await City.findById(id).populate('state').populate('country');
  if (!city) {
    throw new Error('City not found');
  }
  return city;
};

// Retrieve all cities
export const getAllCities = async () => {
  await connectToDatabase();
  return await City.find({}).populate('state').populate('country');
};

// Update a city
export const updateCity = async (id, updateData) => {
  await connectToDatabase();

  // Check if the state and country exist if being updated
  if (updateData.state) {
    const stateExists = await State.findById(updateData.state);
    if (!stateExists) {
      throw new Error('State not found');
    }
  }
  if (updateData.country) {
    const countryExists = await Country.findById(updateData.country);
    if (!countryExists) {
      throw new Error('Country not found');
    }
  }

  const updatedCity = await City.findByIdAndUpdate(id, updateData, { new: true }).populate('state').populate('country');
  if (!updatedCity) {
    throw new Error('City not found');
  }
  return updatedCity;
};

// Delete a city
export const deleteCity = async (id) => {
  await connectToDatabase();
  const deletedCity = await City.findByIdAndDelete(id);
  if (!deletedCity) {
    throw new Error('City not found');
  }
  return deletedCity;
};
