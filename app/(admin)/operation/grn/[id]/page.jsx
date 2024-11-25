

"use client";

import { useEffect, useState } from "react";
import GrnForm from "@/components/operationForm/grnForm";
import { getGrnById } from "@/actions/operation/grnAction";
import { useRouter } from "next/navigation";

export default function EditDepartmentPage({ params }) {
  const { id } = params;
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      const department = await getGrnById(id);
      setDepartmentData(department);
      setLoading(false);
    }
    fetchDepartment();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div >
      <GrnForm type="edit" data={departmentData} />
    </div>
  );
}
