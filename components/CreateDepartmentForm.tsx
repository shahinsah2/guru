'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema for department
const departmentSchema = z.object({
  department_name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface CreateDepartmentFormProps {
  onClose: () => void;
}

export default function CreateDepartmentForm({ onClose }: CreateDepartmentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      const response = await fetch('/api/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Department created successfully');
        onClose();
      } else {
        console.log('Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Department</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Department Name</label>
        <input
          {...register('department_name')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.department_name && <p className="text-red-500">{errors.department_name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register('description')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Create Department
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
