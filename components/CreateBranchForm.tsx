'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the validation schema using Zod
const branchSchema = z.object({
  branchid: z.string().min(1, 'Branch ID is required'),
  branch_name: z.string().min(1, 'Branch name is required'),
  pincode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface CreateBranchFormProps {
  onClose: () => void;
}

export default function CreateBranchForm({ onClose }: CreateBranchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  const onSubmit = async (data: BranchFormData) => {
    try {
      const response = await fetch('/api/branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Branch created successfully');
        onClose();
      } else {
        console.log('Failed to create branch');
      }
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Branch</h2>

      {/* Branch ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Branch ID</label>
        <input
          {...register('branchid')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.branchid && <p className="text-red-500">{errors.branchid.message}</p>}
      </div>

      {/* Branch Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Branch Name</label>
        <input
          {...register('branch_name')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.branch_name && <p className="text-red-500">{errors.branch_name.message}</p>}
      </div>

      {/* Address Fields */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Pincode</label>
        <input
          {...register('pincode')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.pincode && <p className="text-red-500">{errors.pincode.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Country</label>
        <input
          {...register('country')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.country && <p className="text-red-500">{errors.country.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">State</label>
        <input
          {...register('state')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.state && <p className="text-red-500">{errors.state.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">City</label>
        <input
          {...register('city')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Address</label>
        <input
          {...register('address')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.address && <p className="text-red-500">{errors.address.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Create Branch
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
