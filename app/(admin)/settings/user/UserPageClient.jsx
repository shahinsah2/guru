// app/(admin)/settings/user/UserPageClient.jsx

'use client';

import { useState } from 'react';
import CreateUserForm from '@/components/CreateUserForm';
import { DataTable } from '@/components/DataTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function UserPageClient({ userPermissions, users: initialUsers, departments, roles, branches }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  // Utility function to check for permission in the 'Users' module
  const checkPermission = (permissionType) => {
    return userPermissions?.Users?.[permissionType] || false;
  };

  // Check if user has permission for specific actions in the 'Users' module
  const canAdd = checkPermission('can_add');
  const canEdit = checkPermission('can_edit');
  const canDelete = checkPermission('can_delete');

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

  const handleFormClose = (updatedUser) => {
    setIsFormOpen(false);
    setSelectedUser(null);
    if (updatedUser) {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => 
          user._id === updatedUser._id ? updatedUser : user
        );
        return updatedUsers;
      });
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
          {canEdit && (
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row.original)}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          {canDelete && (
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
        {canAdd && (
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
