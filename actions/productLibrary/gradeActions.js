// @/actions/productLibrary/gradeActions.js

"use server";

import { connectToDatabase } from '@/lib/database';
import Grade from '@/lib/database/models/productLibrary/Grade.model';

// Get all grades
export const getGrades = async () => {
  await connectToDatabase();
  const grades = await Grade.find({}).lean();
  return grades.map(grade => ({
    ...grade,
    _id: grade._id.toString(),
  }));
};

// Get a single grade by ID
export const getGradeById = async (id) => {
  await connectToDatabase();
  const grade = await Grade.findById(id);
  if (!grade) {
    return null;
  }
  return {
    ...grade.toObject(),
    _id: grade._id.toString(),
  };
};

// Create a new grade
export const createGrade = async (currentState, gradeData) => {
  await connectToDatabase();

  // Check if the grade_id already exists
  const existingGrade = await Grade.findOne({ grade_id: gradeData.grade_id });
  if (existingGrade) {
    return { success: false, error: true, message: 'Grade ID already exists' };
  }

  const newGrade = new Grade(gradeData);
  const savedGrade = await newGrade.save();
  return { success: true, error: false, grade: savedGrade.toObject() };
};

// Update an existing grade
export const updateGrade = async (currentState, updateData) => {
  const id = updateData.id;
  await connectToDatabase();
  const updatedGrade = await Grade.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedGrade) {
    return { success: false, message: 'Grade not found' };
  }
  return { success: true, grade: updatedGrade.toObject() };
};

// Delete a grade
export const deleteGrade = async (id) => {
  await connectToDatabase();
  const deletedGrade = await Grade.findByIdAndDelete(id);
  if (!deletedGrade) {
    return { success: false, message: 'Grade not found' };
  }
  return { success: true, message: 'Grade deleted successfully' };
};
