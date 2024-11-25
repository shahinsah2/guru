import mongoose, { Schema } from 'mongoose';

const GrnSchema = new Schema({
  grn_number: { type: Number, required: true, unique: true },
  dc_number: { type: Number, required: true },
  owner_number: { type: Number, required: true },
  date: { type: Date, required: true },
  company: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Grn || mongoose.model('Grn', GrnSchema);
