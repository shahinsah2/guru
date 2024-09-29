// app/(admin)/settings/user/page.tsx

'use client';

import { useState, useEffect } from 'react';
import CreateUserForm from '@/components/CreateUserForm';
import { DataTable } from '@/components/DataTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Address {
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
}

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  login_id: string;
  user_code: string;
  emailid: string;
  phone_number: string;
  address?: Address; // Address as a nested object
  roles: { role_name: string; _id: string }[]; // Adjust role structure to match what's expected
  departments: { department_name: string; _id: string }[]; // Adjust departments to match expected structure
  branches: { branch_name: string; _id: string }[]; // Adjust branches to match expected structure
}

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

export default function UserPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Store the user being edited

  useEffect(() => {
    fetchData(); // Fetch initial data when the component mounts
  }, []);

  const fetchData = async () => {
    const userRes = await fetch('/api/user');
    setUsers(await userRes.json());

    const departmentRes = await fetch('/api/department');
    setDepartments(await departmentRes.json());

    const roleRes = await fetch('/api/role');
    setRoles(await roleRes.json());

    const branchRes = await fetch('/api/branch');
    setBranches(await branchRes.json());
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch('/api/user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // Send id in request body
        });
        if (response.ok) {
          alert('User deleted successfully');
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user); // Set the selected user for editing
    setIsFormOpen(true);
  };

  const handleFormClose = async () => {
    setIsFormOpen(false);
    setSelectedUser(null); // Clear the selected user after closing the form
    
      // If a user was created or updated, refetch the data
      await fetchData(); // Fetch the latest users list
    
  };

  const columns = [
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'login_id', header: 'Login ID' },
    { accessorKey: 'user_code', header: 'User Code' },
    { accessorKey: 'emailid', header: 'Email' },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }: { row: { original: User } }) => {
        return row.original.roles.map((role) => role.role_name).join(', ');
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEdit(row.original)} // Pass the entire user object for editing
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row.original._id)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

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

      {isFormOpen && (
        <CreateUserForm
          onClose={handleFormClose}
          departments={departments}
          roles={roles}
          branches={branches}
          user={selectedUser} // Pass the selected user for editing
        />
      )}

      <div className="mt-6">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
