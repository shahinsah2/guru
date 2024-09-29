'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

// Define types for Department, Role, Branch, and Address
interface Department {
  _id: string;
  department_name: string;
}

interface Role {
  _id: string;
  role_name: string;
}

interface Branch {
  _id: string;
  branch_name: string;
}

interface Address {
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
}

interface UserData {
  _id?: string;
  first_name: string;
  last_name: string;
  login_id: string;
  emailid: string;
  phone_number: string;
  roles: Array<{ _id: string } | string>;
  departments: Array<{ _id: string } | string>;
  branches: Array<{ _id: string } | string>;
  address?: Address; // Address is nested under the user
}

// Define the validation schema using Zod
const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  login_id: z.string().min(1, 'Login ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  emailid: z.string().email('Invalid email address'),
  phone_number: z.string().min(4, 'Phone number is required'),
  roles: z.array(z.string()).nonempty('At least one role is required'),
  departments: z.array(z.string()).optional(),
  branches: z.array(z.string()).optional(),
  address: z.object({
    pincode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateUserFormProps {
  onClose: () => void;
  departments: Department[];
  roles: Role[];
  branches: Branch[];
  user?: UserData | null; // Optional user prop for editing
}

export default function CreateUserForm({
  onClose,
  departments,
  roles,
  branches,
  user,
}: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      login_id: user?.login_id || '',
      emailid: user?.emailid || '',
      phone_number: user?.phone_number || '',
      roles: Array.isArray(user?.roles) ? user?.roles.map(role => (typeof role === 'object' ? role._id : role)) : [],
      departments: Array.isArray(user?.departments)
        ? user?.departments.map(department => (typeof department === 'object' ? department._id : department))
        : [],
      branches: Array.isArray(user?.branches) ? user?.branches.map(branch => (typeof branch === 'object' ? branch._id : branch)) : [],
      address: {
        pincode: user?.address?.pincode || '',
        country: user?.address?.country || '',
        state: user?.address?.state || '',
        city: user?.address?.city || '',
      },
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles.map(role => (typeof role === 'object' ? role._id : role)) : [],
        departments: Array.isArray(user.departments)
          ? user.departments.map(department => (typeof department === 'object' ? department._id : department))
          : [],
        branches: Array.isArray(user.branches)
          ? user.branches.map(branch => (typeof branch === 'object' ? branch._id : branch))
          : [],
        address: {
          pincode: user?.address?.pincode || '',
          country: user?.address?.country || '',
          state: user?.address?.state || '',
          city: user?.address?.city || '',
        },
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const cleanData = {
        ...data,
        roles: data.roles || [],
        departments: data.departments || [],
        branches: data.branches || [],
        address: {
          pincode: data.address?.pincode || '',
          country: data.address?.country || '',
          state: data.address?.state || '',
          city: data.address?.city || '',
        },
      };

      const response = await fetch('/api/user', {
        method: user ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user ? { id: user._id, ...cleanData } : cleanData),
      });

      if (response.ok) {
        console.log(user ? 'User updated successfully' : 'User created successfully');
        onClose();
      } else {
        console.log('Failed to submit user');
      }
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{user ? 'Edit User' : 'Create New User'}</h2>

      {/* First Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">First Name</label>
        <input {...register('first_name')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Last Name</label>
        <input {...register('last_name')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
      </div>

      {/* Login ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Login ID</label>
        <input {...register('login_id')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.login_id && <p className="text-red-500">{errors.login_id.message}</p>}
      </div>

      {/* Password (optional when editing) */}
      {!user && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input {...register('password')} type="password" className="w-full border border-gray-300 px-4 py-2 rounded-md" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input {...register('emailid')} type="email" className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.emailid && <p className="text-red-500">{errors.emailid.message}</p>}
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Phone Number</label>
        <input {...register('phone_number')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
      </div>

      {/* Multiple Roles */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Roles</label>
        <select {...register('roles')} multiple className="w-full border border-gray-300 px-4 py-2 rounded-md">
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.role_name}
            </option>
          ))}
        </select>
        {errors.roles && <p className="text-red-500">{errors.roles.message}</p>}
      </div>

      {/* Multiple Departments */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Departments</label>
        <select {...register('departments')} multiple className="w-full border border-gray-300 px-4 py-2 rounded-md">
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.department_name}
            </option>
          ))}
        </select>
        {errors.departments && <p className="text-red-500">{errors.departments.message}</p>}
      </div>

      {/* Multiple Branches */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Branches</label>
        <select {...register('branches')} multiple className="w-full border border-gray-300 px-4 py-2 rounded-md">
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.branch_name}
            </option>
          ))}
        </select>
        {errors.branches && <p className="text-red-500">{errors.branches.message}</p>}
      </div>

      {/* Address (Pincode, Country, State, City) */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Pincode</label>
        <input {...register('address.pincode')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.address?.pincode && <p className="text-red-500">{errors.address.pincode.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Country</label>
        <input {...register('address.country')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.address?.country && <p className="text-red-500">{errors.address.country.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">State</label>
        <input {...register('address.state')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.address?.state && <p className="text-red-500">{errors.address.state.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">City</label>
        <input {...register('address.city')} className="w-full border border-gray-300 px-4 py-2 rounded-md" />
        {errors.address?.city && <p className="text-red-500">{errors.address.city.message}</p>}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          {user ? 'Update User' : 'Create User'}
        </button>
        <button type="button" onClick={onClose} className="ml-4 text-red-500 hover:text-red-600">
          Cancel
        </button>
      </div>
    </form>
  );
}
