'use client';

import { useState, useEffect } from 'react';
import CreateRoleForm from '@/components/CreateRoleForm';
import { DataTable } from '@/components/DataTable'; // Import the generic DataTable component

// Define the types for role
interface Role {
  _id: string;
  role_name: string;
  department_name: string;
}

// Define the columns for the role table
const columns = [
  {
    accessorKey: 'role_name',
    header: 'Role Name',
  },
  {
    accessorKey: 'department_name',
    header: 'Department Name',
  },
];

export default function RolePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const roleRes = await fetch('/api/role');
      const departmentRes = await fetch('/api/department');
      setRoles(await roleRes.json());
      setDepartments(await departmentRes.json());
    }

    fetchData();
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
      {isFormOpen && (
        <CreateRoleForm
          onClose={() => setIsFormOpen(false)}
          departments={departments}
        />
      )}

      {/* Role Table */}
      <div className="mt-6">
        <DataTable columns={columns} data={roles} />
      </div>
    </div>
  );
}
