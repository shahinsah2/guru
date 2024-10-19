// models/TaxList.model.js

import mongoose, { Schema } from 'mongoose';

const TaxListSchema = new Schema({
  tax_name: { type: String, required: true },          // Name of the tax
  percentage_cgst: { type: Number, required: true },   // Percentage for CGST
  percentage_sgst: { type: Number, required: true },   // Percentage for SGST
  active_status: { type: Boolean, default: true },     // Active or inactive status
}, { timestamps: true });

export default mongoose.models.TaxList || mongoose.model('TaxList', TaxListSchema);
