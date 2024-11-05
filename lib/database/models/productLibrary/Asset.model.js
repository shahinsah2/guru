// @/models/productLibrary/Asset.model.js

import mongoose, { Schema } from 'mongoose';

const AssetSchema = new Schema({
  item_name: { type: Schema.Types.ObjectId, ref: 'ItemMaster', required: true },
  item_type: { type: Schema.Types.ObjectId, ref: 'ItemVariant', required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: false },
  warranty_from: { type: Date, required: false },
  warranty_to: { type: Date, required: false },
  warranty_time: { type: Number, required: false },
  remarks: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
