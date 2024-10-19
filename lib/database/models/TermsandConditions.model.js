// models/TermsandConditions.model.js

import mongoose, { Schema } from 'mongoose';

const PointSchema = new Schema({
  point: { type: String, required: true },      // A short description of the point
  description: { type: String, required: false } // Additional description of the point (optional)
});

const TermsandConditionsSchema = new Schema({
  type: { type: String, required: true },
  transactionType: { type: String, required: true },
  points: [PointSchema],
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.TermsandConditions || mongoose.model('TermsandConditions', TermsandConditionsSchema);
