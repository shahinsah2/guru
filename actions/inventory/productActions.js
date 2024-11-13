// @/actions/settings/productActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Product from '@/lib/database/models/Inventory/Products.model'; // Ensure correct import path

// Get all products
export const getProducts = async () => {
  await connectToDatabase();
  const products = await Product.find({}).lean();
  return products.map(product => ({
    ...product,
    _id: product._id.toString(),
  }));
};

// Get a single product by ID
export const getProductById = async (id) => {
  await connectToDatabase();
  const product = await Product.findById(id).lean();
  if (!product) {
    return { success: false, error: true, message: 'Product not found' };
  }
  return { ...product, _id: product._id.toString() };
};

// Create a new product
export const createProduct = async (productsData) => {
  await connectToDatabase();

  try {
    const newProduct = new Product(productsData);
    const savedProduct = await newProduct.save();
    return {
      success: true,
      error: false,
      product: savedProduct.toObject(),
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || 'Failed to create product.',
    };
  }
};

// Update an existing product
export const updateProduct = async (updateData) => {
  await connectToDatabase();
  const { id, ...updateFields } = updateData;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedProduct) {
      return { success: false, error: true, message: 'Product not found' };
    }
    return { success: true, error: false };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || 'Failed to update product.',
    };
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  await connectToDatabase();
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return { success: false, error: true, message: 'Product not found' };
    }
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || 'Failed to delete product.',
    };
  }
};
