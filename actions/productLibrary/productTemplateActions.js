// @/actions/productLibrary/productTemplateActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import ProductTemplate from '@/lib/database/models/productLibrary/ProductTemplate.model';
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

// Get all product templates
export const getProductTemplates = async () => {
  await connectToDatabase();
  const templates = await ProductTemplate.find({})
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .lean();
  return templates.map(template => ({
    ...template,
    _id: template._id.toString(),
    category: template.category?.category_name || '',
    brand: template.brand?.brand_name || '',
  }));
};

// Get Product Template by ID
export const getProductTemplateById = async (id) => {
  await connectToDatabase();
  const template = await ProductTemplate.findById(id)
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .lean();
  if (!template) return null;
  return {
    ...template,
    _id: template._id.toString(),
  };
};

// Create a new product template
export const createProductTemplate = async (currentState, templateData) => {
  try {
    await connectToDatabase();
    const newTemplate = new ProductTemplate(templateData);
    const savedTemplate = await newTemplate.save();
    return { success: true, error: false, message: "Product Template created successfully", template: savedTemplate.toObject() };
  } catch (error) {
    console.error("Error creating product template:", error);
    return { success: false, error: true, message: "Error creating product template." };
  }
};

// Update an existing product template
export const updateProductTemplate = async (currentState, templateData) => {
  try {
    await connectToDatabase();
    const id = templateData.id;
    const updatedTemplate = await ProductTemplate.findByIdAndUpdate(id, templateData, { new: true });
    if (!updatedTemplate) {
      return { success: false, error: true, message: "Product Template not found" };
    }
    return { success: true, error: false, message: "Product Template updated successfully", template: updatedTemplate.toObject() };
  } catch (error) {
    console.error("Error updating product template:", error);
    return { success: false, error: true, message: "Error updating product template." };
  }
};

// Delete a product template
export const deleteProductTemplate = async (id) => {
  await connectToDatabase();
  const deletedTemplate = await ProductTemplate.findByIdAndDelete(id);
  if (!deletedTemplate) {   
    return { success: false, message: 'Product Template not found' };
  }
  return { success: true, message: 'Product Template deleted successfully' };
};
