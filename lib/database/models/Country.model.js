// models/Country.model.js

import mongoose, { Schema } from 'mongoose';

const CountrySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Country name
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Country || mongoose.model('Country', CountrySchema);
