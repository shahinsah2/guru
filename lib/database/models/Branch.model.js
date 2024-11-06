// @/lib/database/models/Branch.model.js

import mongoose, { Schema } from 'mongoose';

const BranchSchema = new Schema({
  branch_id: { type: String, required: true, unique: true },
  branch_name: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
  state: { type: Schema.Types.ObjectId, ref: 'State', required: true },
  city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
