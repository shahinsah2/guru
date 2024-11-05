// @/models/productLibrary/ItemVariant.model.js

import mongoose, { Schema } from 'mongoose';

const ItemVariantSchema = new Schema({
  item_name: { type: Schema.Types.ObjectId, ref: 'ItemMaster', required: true }, // Reference to ItemMaster model
  type: { type: String, required: true },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ItemVariant || mongoose.model('ItemVariant', ItemVariantSchema);
