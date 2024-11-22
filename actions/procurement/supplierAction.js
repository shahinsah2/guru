// Suppliers
'use server';

import { connectToDatabase } from '@/lib/database';
import Supplier from '@/lib/database/models/procurement/Supplier.model';

// Get all suppliers
export const getSupplier = async () => {
  await connectToDatabase();
  const suppliers = await Supplier.find({}).lean();


  return suppliers.map((supplier) => ({
    ...supplier,
    _id: supplier._id.toString(), // Convert ObjectId to string
  }));
};

// Get a single supplier by ID
export const getSupplierById = async (id) => {

  try {
    await connectToDatabase();
    const product = await Supplier.findById(id).lean();
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


// Create a new supplier
export const createSupplier = async (currentState, supplierData) => {
  try {
    await connectToDatabase();
    const newSupplier = new Supplier(supplierData);
    console.log("ccccccccccccccccccccccc",newSupplier)

    const savedSupplier = await newSupplier.save();
    return {
      success: true,
      error: false,
      message: "Supplier created successfully",
      supplier: savedSupplier.toObject(),
    };
  } catch (error) {
    console.error("Error creating supplier:", error);
    return {
      success: false,
      error: true,
      message: "Error creating supplier.",
    };
  }
};

// Update an existing supplier
export const updateSupplier = async (currentState, updateData) => {
  const { id, ...updateFields } = updateData;
  await connectToDatabase();

  try {
    const updatedPurchase = await Supplier.findByIdAndUpdate(id, updateFields, { new: true });
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
// Delete a supplier
export const deleteSupplier = async (id) => {
  await connectToDatabase();

  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return { success: false, error: true, message: 'Supplier details not found' };
    }
    return { success: true, message: 'Supplier details deleted successfully' };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message || 'Failed to delete supplier details.',
    };
  }
};