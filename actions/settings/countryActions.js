// @/actions/countryActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Country from '@/lib/database/models/Country.model';

// Get all countries
export const getCountries = async () => {
  await connectToDatabase();
  const countries = await Country.find({}).lean();
  return countries.map(country => ({
    ...country,
    _id: country._id.toString(),
  }));
};

// Get a single country by ID
export const getCountryById = async (id) => {
  await connectToDatabase();
  const country = await Country.findById(id).lean();
  return country ? { ...country, _id: country._id.toString() } : null;
};

// Create a new country
export const createCountry = async (currentState, countryData) => {
  await connectToDatabase();
  const newCountry = new Country(countryData);
  const savedCountry = await newCountry.save();
  return { success: true, country: savedCountry.toObject() };
};

// Update an existing country
export const updateCountry = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedCountry = await Country.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedCountry) {
    return { success: false, message: 'Country not found' };
  }
  return { success: true, country: updatedCountry.toObject() };
};

// Delete a country
export const deleteCountry = async (id) => {
  await connectToDatabase();
  const deletedCountry = await Country.findByIdAndDelete(id);
  if (!deletedCountry) {
    return { success: false, message: 'Country not found' };
  }
  return { success: true, message: 'Country deleted successfully' };
};
