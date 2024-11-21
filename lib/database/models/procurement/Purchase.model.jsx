// // models/procurement/purchase.model.js
// import mongoose, { Schema } from 'mongoose';

// const PrSchema = new Schema({
//   pr_id: { type: Number, required: true },
//   pr_date: { type: Number, required: true },
//   pr_owner: { type: String, required: true },
//   supplier: { type: String, required: true },
//   total_product_qty: { type: Number, required: true },
//   approve_status: { type: String, required: true },
//   move_to_next: { type: String, required: true },
//   active_status: { type: Boolean, default: true }
// }, { timestamps: true });

// export default mongoose.models.Purchase || mongoose.model('Purchase', PrSchema);

// models/procurement/purchase.model.js


import mongoose, { Schema } from 'mongoose';

const PurchaseSchema = new Schema({
  pr_id: { type: Number, required: true },
  pr_date: { type: Date, required: true },  // Changed to Date type
  pr_owner: { type: String, required: true },
  supplier: { type: String, required: true },
  total_product_qty: { type: Number, required: true },
  approve_status: { type: String, required: true },
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);

