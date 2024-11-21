// PoQuotation
'use server';

import { connectToDatabase } from '@/lib/database';
import PoQuotation from '@/lib/database/models/procurement/Po_quotation.model';



// Get all purchase requests
export const getPoQuotation = async () => {
  await connectToDatabase();
    const products = await PoQuotation.find({}) 
     .lean();
     console.log(products,"data soon");
     
  
    console.log(products,'get data')
    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),  // Convert ObjectId to string
    }));
  };
  
  
  // Get a single product by ID
  export const getPoQuotationById = async (id) => {
    try {
      await connectToDatabase();
      const product = await PoQuotation.findById(id)
        .lean();
      if (!product) return null;
      return {
        ...product,
        _id: product._id.toString(),  // Convert ObjectId to string
      };
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Error fetching product: " + error.message);
    }
  };
  
  
  // Create a new purchase request
  export const createPoQuotation = async (currentState, templateData) => {
    try {
      await connectToDatabase();
      const newTemplate = new PoQuotation(templateData);
      const savedTemplate = await newTemplate.save();
      return { success: true,
         error: false, message: "Product Template created successfully",
          template: savedTemplate.toObject() };
    } catch (error) {
      console.error("Error creating product template:", error);
      return { success: false, error: true, message: "Error creating product ." };
    }
  };
  
  // Update an existing purchase request
  export const updatePoQuotation = async (currentState, updateData) => {
    const { id, ...updateFields } = updateData;
    await connectToDatabase();
  
    try {
      const updatedPurchase = await PoQuotation.findByIdAndUpdate(id, updateFields, { new: true });
      if (!updatedPurchase) {
        return { success: false, error: true, message: 'Purchase details not found' };
      }
      return { success: true, purchase: updatedPurchase.toObject() };
    } catch (error) {
      return {
        success: false,
        error: true,
        message: error.message || 'Failed to update Purchase details.',
      };
    }
  };
  
  // Delete a purchase request
  export const deletePoQuotation = async (id) => {
    await connectToDatabase();
  
    try {
      const deletedPurchase = await PoQuotation.findByIdAndDelete(id);
      if (!deletedPurchase) {
        return { success: false, error: true, message: 'Purchase details not found' };
      }
      return { success: true, message: 'Purchase details deleted successfully' };
    } catch (error) {
      return {
        success: false,
        error: true,
        message: error.message || 'Failed to delete Purchase details.',
      };
    }
  };
  
