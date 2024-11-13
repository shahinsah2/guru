// @/actions/inventory/productsActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Products from '@/lib/database/models/inventory/Products.model';
import ProductCategory from '@/lib/database/models/productLibrary/ProductCategory.model';
import Brand from '@/lib/database/models/productLibrary/Brand.model';
import ItemVariant from '@/lib/database/models/productLibrary/ItemVariant.model';

// Fetch active Product Categories
export const getActiveProductCategories = async () => {
  await connectToDatabase();
  return await ProductCategory.find({ active_status: true }, 'category_name').lean();
};

// Fetch active Brands
export const getActiveBrands = async () => {
  await connectToDatabase();
  return await Brand.find({ active_status: true }, 'brand_name').lean();
};

// Fetch active Item Variants
export const getActiveItemVariants = async () => {
  await connectToDatabase();
  return await ItemVariant.find({ active_status: true }).lean();
};

// Get all products
export const getProducts = async () => {
  await connectToDatabase();
  const products = await Products.find({})
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .lean();
  return products.map(product => ({
    ...product,
    _id: product._id.toString(),
    category: product.category?.category_name || '',
    brand: product.brand?.brand_name || '',
  }));
};

// Get Product by ID
export const getProductById = async (id) => {
  await connectToDatabase();
  const product = await Products.findById(id)
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .lean();
  if (!product) return null;
  return {
    ...product,
    _id: product._id.toString(),
  };
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    await connectToDatabase();
    const newProduct = new Products(productData);
    const savedProduct = await newProduct.save();
    return { success: true, error: false, message: "Product created successfully", product: savedProduct.toObject() };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: true, message: "Error creating product." };
  }
};

// Update an existing product
export const updateProduct = async (productData) => {
  try {
    await connectToDatabase();
    const id = productData.id;
    const updatedProduct = await Products.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
      return { success: false, error: true, message: "Product not found" };
    }
    return { success: true, error: false, message: "Product updated successfully", product: updatedProduct.toObject() };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: true, message: "Error updating product." };
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  await connectToDatabase();
  const deletedProduct = await Products.findByIdAndDelete(id);
  if (!deletedProduct) {   
    return { success: false, message: 'Product not found' };
  }
  return { success: true, message: 'Product deleted successfully' };
};
