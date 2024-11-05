// @/models/productLibrary/ItemMaster.model.js

import mongoose, { Schema } from 'mongoose';

const ItemMasterSchema = new Schema({
  item_name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ItemMaster || mongoose.model('ItemMaster', ItemMasterSchema);
