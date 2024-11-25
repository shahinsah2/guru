import mongoose, { Schema } from 'mongoose';

const DeliveryChallanSchema = new Schema({
  dc_id: { type: Number, required: true, unique: true },
  order_id: { type: Number, required: true },
  quotation_id: { type: Number, required: true },
  dc_date: { type: Date, required: true },
  company: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.DeliveryChallan || mongoose.model('DeliveryChallan', DeliveryChallanSchema);
