// @/lib/database/models/Role.model.js

import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema({
  role_name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  module_access: [
    {
      module_name: { type: String, required: false },
      permissions: { type: Map, of: Boolean, required: false },
    },
  ],
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

// Ensure the model is not redefined on hot-reload
const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

export default Role;
