// models/Role.model.ts

import mongoose, { Schema } from 'mongoose';

const ModuleAccessSchema = new Schema({
  module_name: { type: String, required: true },
  permissions: { type: Map, of: Boolean, required: true }, // Store permissions as a Map
});

const RoleSchema = new Schema({
  role_name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  module_access: [ModuleAccessSchema],
  active_status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
