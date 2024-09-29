// models/Branch.model.ts

import mongoose, { Schema } from 'mongoose';

const BranchSchema = new Schema({
  branchid: { type: String, required: true },
  branch_name: { type: String, required: true },
  address: {
    pincode: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    address: { type: String, required: false }
  }
}, { timestamps: true });

export default mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
