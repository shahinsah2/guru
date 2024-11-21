import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  product_name: { type: String, required: true },
  product_qty: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  image: { type: String, required: false }, // Path to the uploaded image

  specifications: {
    ram: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    processor: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    storage: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    graphics: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } },
    os: { brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' } }
  },
  purchase_price: { type: Number, required: true },
  active_status: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);