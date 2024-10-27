// @/actions/countryActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Country from '@/lib/database/models/Country.model';

// Create a new country
export const createCountry = async (currentStatus, countryData) => {
  await connectToDatabase();
  try {
    const newCountry = new Country(countryData);
    const savedCountry = await newCountry.save();

    return {
      _id: savedCountry._id.toString(),
      countryName: savedCountry.name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to create country.' };
  }
};

// Update an existing country
export const updateCountry = async (currentStatus, updateData) => {
  await connectToDatabase();

  const id = updateData.id;

  try {
    const updatedCountry = await Country.findByIdAndUpdate(id, updateData, { new: true });
    return {
      _id: updatedCountry._id.toString(),
      countryName: updatedCountry.name,
      success: true,
      error: false,
    };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to update country.' };
  }
};

// Delete a country
export const deleteCountry = async (id) => {
  await connectToDatabase();
  try {
    const deletedCountry = await Country.findByIdAndDelete(id);
    if (!deletedCountry) {
      return { success: false, error: true, message: 'Country not found' };
    }
    return { success: true, error: false, message: 'Country deleted successfully' };
  } catch (error) {
    return { success: false, error: true, message: error.message || 'Failed to delete country.' };
  }
};

// Get all countries without pagination
export const getCountries = async () => {
  await connectToDatabase();
  const countries = await Country.find({}).lean();
  return countries.map(country => ({
    ...country,
    _id: country._id.toString(),
  }));
};

// Get the total number of countries
export const getCountriesCount = async () => {
  await connectToDatabase();
  return await Country.countDocuments();
};
