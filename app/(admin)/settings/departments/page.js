// @/app/(admin)/settings/departments/page.jsx

"use client";

import { useEffect, useState } from "react";
import { getDepartments } from "@/actions/settings/departmentActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewDepartmentButton } from "@/components/columns/departmentColumns";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      const data = await getDepartments();
      setDepartments(data);
      setLoading(false);
    }
    fetchDepartments();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewDepartmentButton />
      <DataTable columns={columns} data={departments} />
    </div>
  );
}
