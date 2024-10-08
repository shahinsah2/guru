// @/components/CreateRoleForm.jsx

'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import modulePermissions from '@/lib/config/modulePermissions';

// Define validation schema for role and permissions
const moduleAccessSchema = z.object({
  module_name: z.string().min(1),
  permissions: z.record(z.boolean()), // Allows any permission keys with boolean values
});

const roleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required'),
  department: z.string().min(1, 'Department is required'),
  module_access: z.array(moduleAccessSchema),
});

export default function CreateRoleForm({ onClose, departments }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(roleSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'module_access',
  });

  const [addedModules, setAddedModules] = useState([]); // Track added modules

  // Get the list of modules from the configuration
  const modules = Object.keys(modulePermissions);

  const addModule = (module) => {
    if (!addedModules.includes(module)) {
      // Initialize permissions based on the module configuration
      const permissions = modulePermissions[module].reduce((acc, permission) => {
        acc[permission] = false;
        return acc;
      }, {});

      append({
        module_name: module, // Explicitly cast module to string
        permissions: permissions,
      });
      setAddedModules([...addedModules, module]); // Track added module
    }
  };

  const removeModule = (index, module) => {
    remove(index);
    setAddedModules(addedModules.filter((m) => m !== module)); // Remove from tracked modules
  };

  const onSubmit = async (data) => {
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
          <option value="">Select Department</option>
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
              className={`px-2 py-1 rounded ${addedModules.includes(module) ? 'bg-gray-400' : 'bg-gray-200'}`}
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
              {modulePermissions[field.module_name].map((permission) => (
                <label key={permission}>
                  <input
                    type="checkbox"
                    {...register(`module_access.${index}.permissions.${permission}`)}
                  />{' '}
                  {permission.replace(/_/g, ' ').replace(/can /i, 'Can ')}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Create Role
        </button>
        <button type="button" onClick={onClose} className="ml-4 text-red-500 hover:text-red-600">
          Cancel
        </button>
      </div>
    </form>
  );
}
