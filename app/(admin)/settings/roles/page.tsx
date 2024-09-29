'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema for role and permissions
const roleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required'),
  department: z.string().min(1, 'Department is required'),
  module_access: z.array(z.object({
    module_name: z.string().min(1),
    can_add: z.boolean(),
    can_edit: z.boolean(),
    can_delete: z.boolean(),
    can_activate: z.boolean(),
    can_deactivate: z.boolean(),
    can_search: z.boolean(),
    can_import: z.boolean(),
    can_export: z.boolean(),
    can_print: z.boolean(),
    can_generate_pdf: z.boolean(),
    can_logout: z.boolean(),
  })),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Department {
  _id: string;
  department_name: string;
}

const modules = [
  'Inventory',
  'CRM',
  'Operations',
  'Procurement',
  'Sales',
  'Finance',
];

export default function RolePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]); // Specify type for departments

  // Fetch departments from API
  useEffect(() => {
    async function fetchDepartments() {
      const res = await fetch('/api/department');
      const data: Department[] = await res.json();
      setDepartments(data);
    }
    fetchDepartments();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Create Role
        </button>
      </div>

      {/* Display Form if isFormOpen is true */}
      {isFormOpen && <CreateRoleForm onClose={() => setIsFormOpen(false)} departments={departments} />}
    </div>
  );
}

function CreateRoleForm({ onClose, departments }: { onClose: () => void; departments: Department[] }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'module_access',
  });

  const [addedModules, setAddedModules] = useState<string[]>([]); // Track added modules

  // Prevent adding duplicate modules
  const addModule = (module: string) => {
    if (!addedModules.includes(module)) {
      append({
        module_name: module,
        can_add: false,
        can_edit: false,
        can_delete: false,
        can_activate: false,
        can_deactivate: false,
        can_search: false,
        can_import: false,
        can_export: false,
        can_print: false,
        can_generate_pdf: false,
        can_logout: false,
      });
      setAddedModules([...addedModules, module]); // Track added module
    }
  };

  const removeModule = (index: number, module: string) => {
    remove(index);
    setAddedModules(addedModules.filter((m) => m !== module)); // Remove from tracked modules
  };

  const onSubmit = async (data: RoleFormData) => {
    try {
      const response = await fetch('/api/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Role created successfully');
        onClose();
      } else {
        console.log('Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Role</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Role Name</label>
        <input
          {...register('role_name')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.role_name && <p className="text-red-500">{errors.role_name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Department</label>
        <select
          {...register('department')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        >
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.department_name}
            </option>
          ))}
        </select>
        {errors.department && <p className="text-red-500">{errors.department.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Module Access</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {modules.map((module) => (
            <button
              key={module}
              type="button"
              onClick={() => addModule(module)}
              className="bg-gray-200 px-2 py-1 rounded"
              disabled={addedModules.includes(module)} // Disable button if module is already added
            >
              + {module}
            </button>
          ))}
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 p-4 border border-gray-300 rounded-md">
            <div className="flex justify-between">
              <h4 className="text-lg font-medium">{field.module_name}</h4>
              <button
                type="button"
                onClick={() => removeModule(index, field.module_name)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label><input type="checkbox" {...register(`module_access.${index}.can_add`)} /> Can Add</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_edit`)} /> Can Edit</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_delete`)} /> Can Delete</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_activate`)} /> Can Activate</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_deactivate`)} /> Can Deactivate</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_search`)} /> Can Search</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_import`)} /> Can Import</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_export`)} /> Can Export</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_print`)} /> Can Print</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_generate_pdf`)} /> Can Generate PDF</label>
              <label><input type="checkbox" {...register(`module_access.${index}.can_logout`)} /> Can Logout</label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Create Role
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-red-500 hover:text-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
