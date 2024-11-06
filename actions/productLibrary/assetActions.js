// @/actions/productLibrary/assetActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Asset from '@/lib/database/models/productLibrary/Asset.model';
import ItemMaster from '@/lib/database/models/productLibrary/ItemMaster.model';
import ItemVariant from '@/lib/database/models/productLibrary/ItemVariant.model';
import Brand from '@/lib/database/models/productLibrary/Brand.model';

// Fetch active Item Masters
export const getActiveItemMasters = async () => {
  await connectToDatabase();
  return await ItemMaster.find({ active_status: true }, 'item_name').lean();
};

// Fetch active Item Variants
export const getActiveItemVariants = async () => {
  await connectToDatabase();
  return await ItemVariant.find({ active_status: true }).populate('item_name').lean();
};

// Fetch active Brands
export const getActiveBrands = async () => {
  await connectToDatabase();
  return await Brand.find({ active_status: true }, 'brand_name').lean();
};

// Get all assets
export const getAssets = async () => {
  await connectToDatabase();
  const assets = await Asset.find({})
    .populate('item_name', 'item_name')
    .populate('item_type', 'type')
    .populate('brand', 'brand_name')
    .lean();
  return assets.map(asset => ({
    ...asset,
    _id: asset._id.toString(),
    item_name: asset.item_name?.item_name || '',
    item_type: asset.item_type?.type || '',
    brand: asset.brand?.brand_name || '',
  }));
};

// Get Asset by ID
export const getAssetById = async (id) => {
  await connectToDatabase();
  const asset = await Asset.findById(id)
    .populate('item_name', 'item_name')
    .populate('item_type', 'type')
    .populate('brand', 'brand_name')
    .lean();
  
  if (!asset) return null;
  return {
    ...asset,
    _id: asset._id.toString(),
  };
};

// Create a new asset
export const createAsset = async (currentState, assetData) => {
  try {
    await connectToDatabase();

    // Validate item_name, item_type, and brand exist before creating
    const item = await ItemMaster.findById(assetData.item_name);
    const variant = await ItemVariant.findById(assetData.item_type);
    const brand = await Brand.findById(assetData.brand);

    if (!item) {
      return { success: false, error: true, message: "Item name not found in ItemMaster." };
    }
    if (!variant) {
      return { success: false, error: true, message: "Item type not found in ItemVariant." };
    }
    if (!brand) {
      return { success: false, error: true, message: "Brand not found in Brand model." };
    }

    // Save the new asset
    const newAsset = new Asset(assetData);
    const savedAsset = await newAsset.save();

    return { success: true, error: false, message: "Asset created successfully", asset: savedAsset.toObject() };
  } catch (error) {
    console.error("Error creating asset:", error);
    return { success: false, error: true, message: "Error creating asset." };
  }
};

// Update an existing asset
export const updateAsset = async (currentState, assetData) => {
  try {
    await connectToDatabase();
    const { id, ...updateData } = assetData;

    // Validate item_name, item_type, and brand exist before updating
    const item = await ItemMaster.findById(updateData.item_name);
    const variant = await ItemVariant.findById(updateData.item_type);
    const brand = await Brand.findById(updateData.brand);

    if (!item) {
      return { success: false, error: true, message: "Item name not found in ItemMaster." };
    }
    if (!variant) {
      return { success: false, error: true, message: "Item type not found in ItemVariant." };
    }
    if (!brand) {
      return { success: false, error: true, message: "Brand not found in Brand model." };
    }

    // Update the asset
    const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAsset) {
      return { success: false, error: true, message: "Asset not found" };
    }

    return { success: true, error: false, message: "Asset updated successfully", asset: updatedAsset.toObject() };
  } catch (error) {
    console.error("Error updating asset:", error);
    return { success: false, error: true, message: "Error updating asset." };
  }
};

// Delete an asset
export const deleteAsset = async (id) => {
  await connectToDatabase();
  
  const deletedAsset = await Asset.findByIdAndDelete(id);
  if (!deletedAsset) {   
      return { success: false, message: 'Asset not found' };
    }
    return { success: true, message: 'Asset deleted successfully' };
  
};
