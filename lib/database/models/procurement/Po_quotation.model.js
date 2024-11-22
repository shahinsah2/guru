import mongoose, { Schema } from 'mongoose';

const PoQuotationSchema = new Schema(
  {
    quotation_id: { type: Number, required: true }, // Replaced pr_id with quotation_id
    quotation_date: { type: Date, required: true }, // Replaced pr_date with quotation_date
    quote_owner: { type: String, required: true }, // Replaced pr_owner with quote_owner
    supplier: { type: String, required: true }, // Replaced supplier (same name)
    phone_number: { type: String, required: true }, // Added phone_number field
    purchase_price: { type: Number, required: true }, // Added purchase_price field
    active_status: { type: Boolean, default: true }, // Keeping active_status
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.PoQuotation || mongoose.model('PoQuotation', PoQuotationSchema);
