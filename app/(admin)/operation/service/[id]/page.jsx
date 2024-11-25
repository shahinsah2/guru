// export ddefau

"use client";

import { useEffect, useState } from "react";
import ServiceForm from "@/components/operationForm/serviceForm";
import { getServiceById } from "@/actions/operation/serviceAction";
import { useRouter } from "next/navigation";

export default function EditServicePage({ params }) {
  const { id } = params;
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      const department = await getServiceById(id);
      setDepartmentData(department);
      setLoading(false);

    }
    fetchDepartment();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div >
      <ServiceForm type="edit" data={departmentData} />
    </div>
  );
}
