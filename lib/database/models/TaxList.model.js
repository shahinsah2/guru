// @/models/TaxList.model.js

import mongoose, { Schema } from 'mongoose';

const TaxListSchema = new Schema({
  tax_name: { type: String, required: true, unique: true },
  percentage_cgst: { type: Number, required: true },
  percentage_sgst: { type: Number, required: true },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.TaxList || mongoose.model('TaxList', TaxListSchema);
