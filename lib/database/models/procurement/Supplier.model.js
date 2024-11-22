import mongoose, { Schema } from "mongoose";

const SupplierSchema = new Schema(
  {
    supplier: { type: String, required: true }, 
    website: { type: String, required: false }, 
    emp_name: { type: String, required: true }, 
    e_mail: { type: String, required: true }, 
    emp_mobile: { type: Number, required: true }, 
    emp_office_num: { type: Number, required: false },
    executive: { type: String, required: true }, 
  },
  { timestamps: true } 
);

export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);