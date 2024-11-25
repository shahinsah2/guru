

"use client";

import { useEffect, useState } from "react";
import InvoiceForm from "@/components/operationForm/invoiceForm";
import { getInvoiceById } from "@/actions/operation/invoiceAction";
import { useRouter } from "next/navigation";

export default function EditDepartmentPage({ params }) {
  const { id } = params;
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      const department = await getInvoiceById(id);
      setDepartmentData(department);
      setLoading(false);
    }
    fetchDepartment();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div >
      <InvoiceForm type="edit" data={departmentData} />
    </div>
  );
}
