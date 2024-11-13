// // @/models/inventory/Products.model.js

// import mongoose, { Schema } from 'mongoose';

// const ProductSchema = new Schema({
//   product_name: { type: String, required: true },
//   category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
//   brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
//   model: { type: String, required: true },
//   description: { type: String },
//   image: { type: String }, // Path to the uploaded image
//   quantity: { type: Number, required: true, default: 0 },
//   price_purchase: { type: Number, required: true },
//   price_rental_30_days: { type: Number, required: true },
//   specifications: {
//     ram: {
//       brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
//       type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' }
//     },
//     processor: {
//       brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
//       type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' }
//     },
//     storage: {
//       brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
//       type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' }
//     },
//     graphics: {
//       brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
//       type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' }
//     },
//     os: {
//       brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
//       type: { type: Schema.Types.ObjectId, ref: 'ItemVariant' }
//     }
//   },
//   product_status: {
//     on_rent: { type: Number, default: 0 }, // Quantity currently rented
//     available: { type: Number, default: 0 } // Quantity available in stock
//   },
//   active_status: { type: Boolean, default: true }
// }, { timestamps: true });

// export default mongoose.models.Products || mongoose.model('Products', ProductSchema);
import mongoose, { Schema } from 'mongoose';

const ProductsSchema = new Schema({
    owner: { type: String, required: true },
    select_supplier: { type: String, required: true },
    supplier_mail: { type: String, required: true },
    supplier_name: { type: String, required: true },
    total_price: { type: Number, required: true },
    active_status: { type: Boolean, default: true },
}, { timestamps: true });


export default mongoose.models.Products || mongoose.model('Products', ProductsSchema);
