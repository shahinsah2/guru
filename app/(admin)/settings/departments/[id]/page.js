// @/app/(admin)/settings/departments/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import DepartmentForm from "@/components/settingsForms/DepartmentForm";
import { getDepartmentById } from "@/actions/settings/departmentActions";
import { useRouter } from "next/navigation";

export default function EditDepartmentPage({ params }) {
  const { id } = params;
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      const department = await getDepartmentById(id);
      setDepartmentData(department);
      setLoading(false);
    }
    fetchDepartment();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <DepartmentForm type="edit" data={departmentData} />
    </div>
  );
}
