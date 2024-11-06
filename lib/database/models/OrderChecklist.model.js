// @/lib/database/models/OrderChecklist.model.js

import mongoose, { Schema } from 'mongoose';

const OrderChecklistSchema = new Schema({
  checklist_name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  checklist_qty: { type: Number, required: true },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.OrderChecklist || mongoose.model('OrderChecklist', OrderChecklistSchema);
