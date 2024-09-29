'use client';

import { useState, useEffect } from 'react';
import CreateDepartmentForm from '@/components/CreateDepartmentForm';
import { DataTable } from '@/components/DataTable'; // Import the generic DataTable component

// Define the types for department
interface Department {
  _id: string;
  department_name: string;
  description: string;
}

// Define the columns for the department table
const columns = [
  {
    accessorKey: 'department_name',
    header: 'Department Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
];

export default function DepartmentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const res = await fetch('/api/department');
      const data = await res.json();
      setDepartments(data);
    }

    fetchDepartments();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Create Department
        </button>
      </div>

      {/* Display Form if isFormOpen is true */}
      {isFormOpen && <CreateDepartmentForm onClose={() => setIsFormOpen(false)} />}

      {/* Department Table */}
      <div className="mt-6">
        <DataTable columns={columns} data={departments} />
      </div>
    </div>
  );
}
