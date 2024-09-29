// models/Department.model.ts

import mongoose, { Schema } from 'mongoose';

const DepartmentSchema = new Schema({
  department_name: { type: String, required: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
