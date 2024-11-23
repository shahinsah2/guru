"use server";

import { connectToDatabase } from "@/lib/database";
import UserPerformance from "@/lib/database/models/user-performance/UserPerformance.model";

// Get all user performances
export const getUserPerformances = async () => {
  await connectToDatabase();
  const performances = await UserPerformance.find({})
    .populate("role", "role_name")
    .populate("department", "department_name")
    .lean();
  return performances.map((performance) => ({
    ...performance,
    _id: performance._id.toString(),
  }));
};

// Get a single user performance by ID
export const getUserPerformanceById = async (id) => {
  await connectToDatabase();
  const performance = await UserPerformance.findById(id)
    .populate("role", "role_name")
    .populate("department", "department_name")
    .lean();
  if (!performance) {
    return { success: false, error: true, message: "User Performance not found" };
  }
  return { ...performance, _id: performance._id.toString() };
};

// Create a new user performance record
export const createUserPerformance = async (performanceData) => {
  console.log("Received data:", performanceData);
  await connectToDatabase();
  try {
    const newPerformance = new UserPerformance(performanceData);
    const savedPerformance = await newPerformance.save();
    console.log(savedPerformance.toObject(), "Actionnnnn");
    
    return { success: true, performance: savedPerformance.toObject() };
  } catch (error) {
    return { success: false, error: true, message: error.message || "Failed to create user performance" };
  }
};

// Update an existing user performance record
export const updateUserPerformance = async (updateData) => {
  const { id, ...data } = updateData;
  await connectToDatabase();
  try {
    const updatedPerformance = await UserPerformance.findByIdAndUpdate(id, data, { new: true })
      .populate("role", "role_name")
      .populate("department", "department_name");
    if (!updatedPerformance) {
      return { success: false, error: true, message: "User Performance not found" };
    }
    return { success: true, performance: updatedPerformance.toObject() };
  } catch (error) {
    return { success: false, error: true, message: error.message || "Failed to update user performance" };
  }
};

// Delete a user performance record
export const deleteUserPerformance = async (id) => {
  await connectToDatabase();
  try {
    const deletedPerformance = await UserPerformance.findByIdAndDelete(id);
    if (!deletedPerformance) {
      return { success: false, error: true, message: "User Performance not found" };
    }
    return { success: true, message: "User Performance deleted successfully" };
  } catch (error) {
    return { success: false, error: true, message: "Failed to delete user performance" };
  }
};
