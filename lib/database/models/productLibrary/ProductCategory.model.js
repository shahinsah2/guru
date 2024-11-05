// @/models/productLibrary/ProductCategory.model.js

import mongoose, { Schema } from 'mongoose';

const ProductCategorySchema = new Schema({
  category_code: { type: String, required: true, unique: true },
  category_name: { type: String, required: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ProductCategory || mongoose.model('ProductCategory', ProductCategorySchema);
