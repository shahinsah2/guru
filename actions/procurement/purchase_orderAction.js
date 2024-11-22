"use server";

import { connectToDatabase } from "@/lib/database";
import Po from "@/lib/database/models/procurement/Purchase_order.model";

// Get all purchase requests
export const getPo = async () => {
  await connectToDatabase();

    const products = await Po.find({}) 

     .lean();
     
     console.log(products,"datagggggggggggggggggggg ");

    console.log(products,'get data')
    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),  // Convert ObjectId to string
    }));
  };

// Get a single purchase request by ID
export const getPoById = async (id) => {

  try {
    await connectToDatabase();
    const product = await Po.findById(id).lean();
    console.log("Acccccccc",product)
    if (!product) {
      throw new Error("Purchase order not found");
    }
    return {
      ...product,
      _id: product._id.toString(), // Convert ObjectId to string
    };
  } catch (error) {
    console.error("Error fetching purchase order by ID:", error);
    throw new Error("Error fetching purchase order: " + error.message);
  }
};

// Create a new purchase request
export const createPo = async (currentState, templateData) => {
  try {
    await connectToDatabase();
    const newTemplate = new Po(templateData);
    console.log("Abbbbbbbbb",newTemplate)
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
export const updatePo = async (currentState, updateData) => {
  const { id, ...updateFields } = updateData;
  await connectToDatabase();

  try {
    const updatedPurchase = await Po.findByIdAndUpdate(id, updateFields, { new: true });
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
export const deletePo = async (id) => {
  try {
    await connectToDatabase();
    const deletedPurchase = await Po.findByIdAndDelete(id);
    if (!deletedPurchase) {
      throw new Error("Purchase order not found for deletion");
    }
    return { success: true, message: "Purchase order deleted successfully" };
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return {
      success: false,
      error: true,
      message: error.message || "Failed to delete purchase order.",
    };
  }
};