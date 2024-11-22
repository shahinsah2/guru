import mongoose, { Schema } from "mongoose";

const PurchaseOrderSchema = new Schema(
  {
    po_id: { type: Number, required: true }, // Purchase Order ID
    po_quotation_id: { type: Number, required: true }, // Purchase Quotation ID
    po_date: { type: Date, required: true }, // Purchase Order Date
    po_owner: { type: String, required: true }, // Owner of the Purchase Order
    supplier: { type: String, required: true }, // Supplier name
    supplier_number: { type: Number, required: true }, // Supplier contact number
    total_cost: { type: Number, required: true }, // Total amount
    product_qty: { type: Number, required: true }, // Quantity of products
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default mongoose.models.Po || mongoose.model("Po", PurchaseOrderSchema);