// models/ServiceStatus.model.js

import mongoose, { Schema } from 'mongoose';

const ServiceStatusSchema = new Schema({
  status_name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ServiceStatus || mongoose.model('ServiceStatus', ServiceStatusSchema);
