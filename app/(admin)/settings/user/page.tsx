// app/(admin)/settings/user/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define types for Department, Role, and Branch
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

// Define the validation schema using Zod
const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  login_id: z.string().min(1, 'Login ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  emailid: z.string().email('Invalid email address'),
  phone_number: z.string().min(4, 'Phone number is required'),
  roles: z.array(z.string()).nonempty('At least one role is required'),
  departments: z.array(z.string()).optional(), // Multiple departments
  branches: z.array(z.string()).optional(), // Multiple branches
  pincode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Fetch departments, roles, and branches from API (you can modify this based on your API)
  useEffect(() => {
    async function fetchData() {
      const departmentRes = await fetch('/api/department');
      const roleRes = await fetch('/api/role');
      const branchRes = await fetch('/api/branch');
      setDepartments(await departmentRes.json());
      setRoles(await roleRes.json());
      setBranches(await branchRes.json());
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Create User
        </button>
      </div>

      {/* Display Form if isFormOpen is true */}
      {isFormOpen && (
        <CreateUserForm
          onClose={() => setIsFormOpen(false)}
          departments={departments}
          roles={roles}
          branches={branches}
        />
      )}
    </div>
  );
}

function CreateUserForm({
  onClose,
  departments,
  roles,
  branches,
}: {
  onClose: () => void;
  departments: Department[];
  roles: Role[];
  branches: Branch[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('User created successfully');
        onClose();
      } else {
        console.log('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>

      {/* First Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">First Name</label>
        <input
          {...register('first_name')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Last Name</label>
        <input
          {...register('last_name')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
      </div>

      {/* Login ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Login ID</label>
        <input
          {...register('login_id')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.login_id && <p className="text-red-500">{errors.login_id.message}</p>}
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Password</label>
        <input
          {...register('password')}
          type="password"
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register('emailid')}
          type="email"
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.emailid && <p className="text-red-500">{errors.emailid.message}</p>}
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          {...register('phone_number')}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
      </div>

      {/* Multiple Roles */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Roles</label>
        <select
          {...register('roles')}
          multiple
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        >
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
        <select
          {...register('departments')}
          multiple
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        >
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
        <select
          {...register('branches')}
          multiple
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        >
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

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Create User
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
