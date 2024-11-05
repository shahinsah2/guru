// @/actions/productLibrary/brandActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Brand from '@/lib/database/models/productLibrary/Brand.model';

// Get all brands
export const getBrands = async () => {
  await connectToDatabase();
  const brands = await Brand.find({}).lean();
  return brands.map(brand => ({
    ...brand,
    _id: brand._id.toString(),
  }));
};

// Get a single brand by ID
export const getBrandById = async (id) => {
  await connectToDatabase();
  const brand = await Brand.findById(id);
  if (!brand) {
    return null;
  }
  return {
    ...brand.toObject(),
    _id: brand._id.toString(),
  };
};

// Create a new brand
export const createBrand = async (currentState, brandData) => {
  await connectToDatabase();

  // Check if the brand_number already exists
  const existingBrand = await Brand.findOne({ brand_number: brandData.brand_number });
  if (existingBrand) {
    return { success: false, error: true, message: 'Brand Number already exists' };
  }

  const newBrand = new Brand(brandData);
  const savedBrand = await newBrand.save();
  return { success: true, error: false, brand: savedBrand.toObject() };
};

// Update an existing brand
export const updateBrand = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedBrand) {
    return { success: false, message: 'Brand not found' };
  }
  return { success: true, brand: updatedBrand.toObject() };
};

// Delete a brand
export const deleteBrand = async (id) => {
  await connectToDatabase();
  const deletedBrand = await Brand.findByIdAndDelete(id);
  if (!deletedBrand) {
    return { success: false, message: 'Brand not found' };
  }
  return { success: true, message: 'Brand deleted successfully' };
};
