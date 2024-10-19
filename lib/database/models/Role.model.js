// @/lib/database/models/Role.model.js

import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema({
  role_name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  module_access: [
    {
      module_name: { type: String, required: true },
      permissions: { type: Map, of: Boolean, required: true },
    },
  ],
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
