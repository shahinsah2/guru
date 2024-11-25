

"use client";

import { useEffect, useState } from "react";
import DeliveryChallanForm from "@/components/operationForm/delivery_challanForm";
import { getDeliveryChallanById } from "@/actions/operation/delivery_challanAction";
import { useRouter } from "next/navigation";

export default function EditDepartmentPage({ params }) {
  const { id } = params;
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      const department = await getDeliveryChallanById(id);
      setDepartmentData(department);
      setLoading(false);
    }
    fetchDepartment();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div >
      <DeliveryChallanForm type="edit" data={departmentData} />
    </div>
  );
}
