// models/Location.model.js

import mongoose, { Schema } from 'mongoose';

const LocationSchema = new Schema({
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true }, // Link to Country
  state: { type: Schema.Types.ObjectId, ref: 'State', required: false },    // Link to State (optional)
  city: { type: Schema.Types.ObjectId, ref: 'City', required: false },      // Link to City (optional)
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
