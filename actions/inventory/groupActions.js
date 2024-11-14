"use server";

import { connectToDatabase } from '@/lib/database';
import Group from '@/lib/database/models/inventory/Group.model';
import ProductCategory from '@/lib/database/models/productLibrary/ProductCategory.model';
import Brand from '@/lib/database/models/productLibrary/Brand.model';
import fetch from 'node-fetch';  // For server-side fetch functionality
import FormData from 'form-data'; // For handling FormData on the server-side

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

// Get all groups
export const getGroups = async () => {
  await connectToDatabase();
  const groups = await Group.find({})
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .lean();
  return groups.map(group => ({
    ...group,
    _id: group._id.toString(),
    category: group.category?.category_name || '',
    brand: group.brand?.brand_name || '',
  }));
};

// Get Group by ID
export const getGroupById = async (id) => {
  await connectToDatabase();
  const group = await Group.findById(id)
    .populate('category', 'category_name')
    .populate('brand', 'brand_name')
    .lean();
  if (!group) return null;
  return {
    ...group,
    _id: group._id.toString(),
  };
};

// Upload image to Cloudinary
export const uploadImage = async (file) => { // Now it's exported
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Set your Cloudinary upload preset

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.secure_url; // Return the image URL
};

// Create a new group
export const createGroup = async (groupData) => {
  try {
    // Assuming the image URL is passed from the client side
    const imageUrl = groupData.image;

    // Save the group with the image URL
    await connectToDatabase();
    const newGroup = new Group({ ...groupData, image: imageUrl });
    const savedGroup = await newGroup.save();
    return { success: true, error: false, message: "Group created successfully", group: savedGroup.toObject() };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: true, message: "Error creating group." };
  }
};


// Update an existing group
export const updateGroup = async (groupData) => {
  try {
    // Handle image upload if a new image is provided
    let imageUrl = groupData.image;
    if (groupData.image instanceof File) {
      imageUrl = await uploadImage(groupData.image);
    }

    // Update the group with the new data and image URL
    await connectToDatabase();
    const id = groupData.id;
    const updatedGroup = await Group.findByIdAndUpdate(id, { ...groupData, image: imageUrl }, { new: true });
    if (!updatedGroup) {
      return { success: false, error: true, message: "Group not found" };
    }
    return { success: true, error: false, message: "Group updated successfully", group: updatedGroup.toObject() };
  } catch (error) {
    console.error("Error updating group:", error);
    return { success: false, error: true, message: "Error updating group." };
  }
};

// Delete a group
export const deleteGroup = async (id) => {
  await connectToDatabase();
  const deletedGroup = await Group.findByIdAndDelete(id);
  if (!deletedGroup) {
    return { success: false, message: 'Group not found' };
  }
  return { success: true, message: 'Group deleted successfully' };
};
