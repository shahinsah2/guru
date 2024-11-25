import mongoose, { Schema } from 'mongoose';

const InvoiceSchema = new Schema({
  invoice_number: { type: Number, required: true, unique: true },
  dc_number: { type: Number, required: true },
  // dc_id: { type: Schema.Types.ObjectId, ref: 'DeliveryChallan', required: true },
  order_number: { type: Number, required: true },
  customer_number: { type: Number, required: true },
  invoice_date: { type: Date, required: true },
  customer_name: { type: String, required: true },
  created_by: { type: String, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
