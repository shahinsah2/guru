// @/actions/countryActions.js

import { connectToDatabase } from '@/lib/database';
import Country from '@/lib/database/models/Country.model';

// Create a new country
export const createCountry = async (countryData) => {
  await connectToDatabase();
  const newCountry = new Country(countryData);
  return await newCountry.save();
};

// Retrieve a country by ID
export const getCountryById = async (id) => {
  await connectToDatabase();
  const country = await Country.findById(id);
  if (!country) {
    throw new Error('Country not found');
  }
  return country;
};

// Retrieve all countries
export const getAllCountries = async () => {
  await connectToDatabase();
  return await Country.find({});
};

// Update a country
export const updateCountry = async (id, updateData) => {
  await connectToDatabase();
  const updatedCountry = await Country.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedCountry) {
    throw new Error('Country not found');
  }
  return updatedCountry;
};

// Delete a country
export const deleteCountry = async (id) => {
  await connectToDatabase();
  const deletedCountry = await Country.findByIdAndDelete(id);
  if (!deletedCountry) {
    throw new Error('Country not found');
  }
  return deletedCountry;
};
