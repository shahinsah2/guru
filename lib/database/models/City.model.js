// models/City.model.js

import mongoose, { Schema } from 'mongoose';

const CitySchema = new Schema({
  name: { type: String, required: true },
  state: { type: Schema.Types.ObjectId, ref: 'State', required: true }, // Link to State
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true }, // Link to Country
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.City || mongoose.model('City', CitySchema);
