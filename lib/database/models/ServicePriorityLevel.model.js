// models/ServicePriorityLevel.model.js

import mongoose, { Schema } from 'mongoose';

const ServicePriorityLevelSchema = new Schema({
  priority_level: { type: String, required: true, unique:true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ServicePriorityLevel || mongoose.model('ServicePriorityLevel', ServicePriorityLevelSchema);
