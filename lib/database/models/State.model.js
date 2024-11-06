// models/State.model.js

import mongoose, { Schema } from 'mongoose';

const StateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true }, // Link to Country
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.State || mongoose.model('State', StateSchema);
