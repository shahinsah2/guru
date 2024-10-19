// models/LeadStatus.model.js

import mongoose, { Schema } from 'mongoose';

const LeadStatusSchema = new Schema({
  status_name: { type: String, required: true },      // Name of the lead status
  description: { type: String, required: false },     // Description of the status
  active_status: { type: Boolean, default: true },    // Active or inactive status
}, { timestamps: true });

export default mongoose.models.LeadStatus || mongoose.model('LeadStatus', LeadStatusSchema);
