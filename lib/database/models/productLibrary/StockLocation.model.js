// @/models/productLibrary/StockLocation.model.js

import mongoose, { Schema } from 'mongoose';

const StockLocationSchema = new Schema({
  stock_location_id: { type: String, required: true, unique: true },
  stock_name: { type: String, required: false },
  mail_id: { type: String, required: false },
  phone_number: { type: String, required: false },
  address: {
    pincode: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    landmark: { type: String, required: false },
    street: { type: String, required: false }
  },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.StockLocation || mongoose.model('StockLocation', StockLocationSchema);
