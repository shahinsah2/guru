// models/LeadChecklist.model.js

import mongoose, { Schema } from 'mongoose';

const LeadChecklistSchema = new Schema({
  checklist_name: { type: String, required: true },
  description: { type: String, required: false },
  checklist_qty: { type: Number, required: true },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.LeadChecklist || mongoose.model('LeadChecklist', LeadChecklistSchema);
