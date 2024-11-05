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
  await connectToDatabase();

  const newAsset = new Asset(assetData);
  await newAsset.save();

  currentState.success = true;
  currentState.message = "Asset created successfully";
  return newAsset.toObject();
};

// Update an existing asset
export const updateAsset = async (currentState, assetData) => {
  await connectToDatabase();
  const { id, ...updateData } = assetData;

  const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedAsset) {
    currentState.error = true;
    currentState.message = "Asset not found";
    return null;
  }

  currentState.success = true;
  currentState.message = "Asset updated successfully";
  return updatedAsset.toObject();
};

// Delete an asset
export const deleteAsset = async (id) => {
  await connectToDatabase();
  
  const deletedAsset = await Asset.findByIdAndDelete(id);
  if (!deletedAsset) {
    currentState.error = true;
    currentState.message = "Asset not found";
    return null;
  }

  currentState.success = true;
  currentState.message = "Asset deleted successfully";
  return { success: true };
};
