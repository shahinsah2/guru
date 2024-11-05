// @/models/productLibrary/Brand.model.js

import mongoose, { Schema } from 'mongoose';

const BrandSchema = new Schema({
  brand_number: { type: String, required: true, unique: true },
  brand_name: { type: String, required: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
