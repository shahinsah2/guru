// @/app/(admin)/settings/user/page.jsx

'use client';

import { useState, useEffect, useContext } from 'react';
import { PermissionsContext } from '@/context/PermissionsContext'; // Import from the correct file
import CreateUserForm from '@/components/CreateUserForm';
import { DataTable } from '@/components/DataTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function UserPage() {
  const userPermissions = useContext(PermissionsContext); // Get permissions from context
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
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
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch('/api/user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleFormClose = async (updatedUser) => {
    setIsFormOpen(false);
    setSelectedUser(null);
    if (updatedUser) {
      const userRes = await fetch('/api/user');
      setUsers(await userRes.json());
    }
  };

  const columns = [
    { accessorKey: 'first_name', header: 'First Name' },
    { accessorKey: 'last_name', header: 'Last Name' },
    { accessorKey: 'login_id', header: 'Login ID' },
    { accessorKey: 'emailid', header: 'Email' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {userPermissions.canEdit && (
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row.original)}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          {userPermissions.canDelete && (
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(row.original._id)}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
    },
  ];


  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>        
        {userPermissions.canAdd && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Create User
          </button>
        )}
      </div>

      {isFormOpen && (
        <CreateUserForm
          onClose={handleFormClose}
          departments={departments}
          roles={roles}
          branches={branches}
          user={selectedUser}
        />
      )}

      <div className="mt-6">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
