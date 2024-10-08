// @/app/(admin)/settings/branch/page.jsx

'use client';

import { useState, useEffect } from 'react';
import CreateBranchForm from '@/components/CreateBranchForm';
import { DataTable } from '@/components/DataTable'; // Import the generic DataTable component

// Define the columns for the branch table
const columns = [
  {
    accessorKey: 'branch_name',
    header: 'Branch Name',
  },
  {
    accessorKey: 'pincode',
    header: 'Pincode',
  },
];

export default function BranchPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    async function fetchBranches() {
      const res = await fetch('/api/branch');
      const data = await res.json();
      setBranches(data);
    }

    fetchBranches();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Branches</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Create Branch
        </button>
      </div>

      {/* Display Form if isFormOpen is true */}
      {isFormOpen && <CreateBranchForm onClose={() => setIsFormOpen(false)} />}

      {/* Branch Table */}
      <div className="mt-6">
        <DataTable columns={columns} data={branches} />
      </div>
    </div>
  );
}
