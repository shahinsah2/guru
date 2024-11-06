// @/app/(admin)/settings/service-status/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import ServiceStatusForm from "@/components/settingsForms/ServiceStatusForm";
import { getServiceStatusById } from "@/actions/serviceStatusActions";
import { useRouter } from "next/navigation";

export default function EditServiceStatusPage({ params }) {
  const { id } = params;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      const status = await getServiceStatusById(id);
      setStatusData(status);
      setLoading(false);
    }
    fetchStatus();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ServiceStatusForm type="edit" data={statusData} />
    </div>
  );
}
