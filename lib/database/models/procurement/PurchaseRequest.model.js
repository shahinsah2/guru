// @/models/procurement/PurchaseRequest.model.js

import mongoose, { Schema } from 'mongoose';

const PurchaseRequestSchema = new Schema(
  {
    purchase_request_id: { type: String, required: true },
    po_date: { type: Date, required: true }, 
    order_type: { type: String, enum: ['Sale', 'Buy'], required: true }, 
    // owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    owner: { type: String, required: true }, 
    supplier: {
      supplier_name: { type: String, required: true },
      supplier_email: { type: String, required: true }, 
      supplier_number: { type: String, required: true } 
    },
    additional_info: {
      purchase_type: { type: String, enum: ['Buy', 'Sale'], required: false },
      description: { type: String }
    },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'ProductTemplate', required: true },
        quantity: { type: Number, required: true },
      }
    ],
    total_quantity: { type: Number, required: true },
    active_status: { type: Boolean, default: true } 
  },
  { timestamps: true }
);

export default mongoose.models.PurchaseRequest || mongoose.model('PurchaseRequest', PurchaseRequestSchema);
