// models/Role.model.ts

import mongoose, { Schema } from 'mongoose';

const ModuleAccessSchema = new Schema({
  module_name: { type: String, required: true },  // Inventory, CRM, etc.
  can_add: { type: Boolean, default: false },
  can_edit: { type: Boolean, default: false },
  can_delete: { type: Boolean, default: false },
  can_activate: { type: Boolean, default: false },
  can_deactivate: { type: Boolean, default: false },
  can_search: { type: Boolean, default: false },
  can_import: { type: Boolean, default: false },
  can_export: { type: Boolean, default: false },
  can_print: { type: Boolean, default: false },
  can_generate_pdf: { type: Boolean, default: false },
  can_logout: { type: Boolean, default: false }  // Optional, for user management module
});

const RoleSchema = new Schema({
  role_name: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  description: { type: String, required: false },
  active_status: { type: Boolean, default: true },
  module_access: [ModuleAccessSchema]  // Array to define access levels per module
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
