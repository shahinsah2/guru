// models/User.model.ts

import mongoose, { Schema } from 'mongoose';

const AddressSchema = new Schema({
  pincode: { type: String, required: false },
  country: { type: String, required: false },
  state: { type: String, required: false },
  city: { type: String, required: false },
  landmark: { type: String, required: false },
  street: { type: String, required: false }
});

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  login_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_code: { type: String, required: false },
  joining_date: { type: Date, required: false },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role', required: true }], // Updated to allow multiple roles
  departments: [{ type: Schema.Types.ObjectId, ref: 'Department', required: false }], // Multiple departments
  branches: [{ type: Schema.Types.ObjectId, ref: 'Branch', required: false }], // Multiple branches
  emailid: { type: String, required: false },
  phone_number: { type: String, required: false },
  address: { type: AddressSchema, required: false },
  active_status: { type: Boolean, default: true },
  team_head: { type: Schema.Types.ObjectId, ref: 'User' },
  clerkid: { type: String, required: false },
  
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

