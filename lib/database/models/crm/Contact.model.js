
import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema(
  {
    customer_id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    customer_type: { type: String, required: true },
    company_name: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: {
      pincode: { type: String },
      country: { type: String },
      state: { type: String },
      city: { type: String },
      street: { type: String },
      landmark: { type: String },
    },
    bank_details: {
      bank_name: { type: String },
      bank_address: { type: String },
      account_number: { type: String },
      pan_number: { type: String },
      contact_person_in_bank: { type: String },
      contact_person_phone: { type: String },
      other_details: { type: String },
    },
    owner: { type: String, required: true },
    contact_generated_by: { type: String, required: true },
    remarks: { type: String },
    active_status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
