// @/actions/productLibrary/productCategoryActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import ProductCategory from '@/lib/database/models/productLibrary/ProductCategory.model';

// Get all product categories
export const getProductCategories = async () => {
  await connectToDatabase();
  const categories = await ProductCategory.find({}).lean();
  return categories.map(category => ({
    ...category,
    _id: category._id.toString(),
  }));
};

// Get a single product category by ID
export const getProductCategoryById = async (id) => {
  await connectToDatabase();
  const category = await ProductCategory.findById(id);
  if (!category) {
    return null;
  }
  return {
    ...category.toObject(),
    _id: category._id.toString(),
  };
};

// Create a new product category
export const createProductCategory = async (currentState, categoryData) => {

  // Check if the category_code already exists
  const existingCategory = await ProductCategory.findOne({ category_code: categoryData.category_code });
  if (existingCategory) {
    return { success: false, error: true, message: 'Category Code already exists' };
  }

  await connectToDatabase();
  const newCategory = new ProductCategory(categoryData);
  const savedCategory = await newCategory.save();
  return { success: true, error: false, category: savedCategory.toObject() };
};

// Update an existing product category
export const updateProductCategory = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedCategory = await ProductCategory.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedCategory) {
    return { success: false, message: 'Product Category not found' };
  }
  return { success: true, category: updatedCategory.toObject() };
};

// Delete a product category
export const deleteProductCategory = async (id) => {
  await connectToDatabase();
  const deletedCategory = await ProductCategory.findByIdAndDelete(id);
  if (!deletedCategory) {
    return { success: false, message: 'Product Category not found' };
  }
  return { success: true, message: 'Product Category deleted successfully' };
};
