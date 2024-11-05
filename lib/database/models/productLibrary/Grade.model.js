// @/models/productLibrary/Grade.model.js

import mongoose, { Schema } from 'mongoose';

const GradeSchema = new Schema({
  grade_id: { type: String, required: true, unique: true },
  grade_name: { type: String, required: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Grade || mongoose.model('Grade', GradeSchema);
