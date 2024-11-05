// @/models/productLibrary/ProductTemplate.model.js

import mongoose, { Schema } from 'mongoose';

const ProductTemplateSchema = new Schema({
  product_name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false }, // Path to the uploaded image
  specifications: {
    ram: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    processor: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    storage: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    graphics: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    os: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } }
  },
  active_status: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.ProductTemplate || mongoose.model('ProductTemplate', ProductTemplateSchema);
