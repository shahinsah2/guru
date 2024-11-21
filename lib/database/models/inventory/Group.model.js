import mongoose, { Schema } from 'mongoose';

const GroupSchema = new Schema(
  {
    group_name: { type: String, required: true },
    description: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: 'Products' }], // Array of product references
    category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' }, // Optional category for the group
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, // Add this line for the brand reference
    active_status: { type: Boolean, default: true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
