// @/app/(admin)/settings/service-priority-level/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import ServicePriorityLevelForm from "@/components/settingsForms/ServicePriorityLevelForm";
import { getServicePriorityLevelById } from "@/actions/settings/servicePriorityLevelActions";
import { useRouter } from "next/navigation";

export default function EditServicePriorityLevelPage({ params }) {
  const { id } = params;
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLevel() {
      const level = await getServicePriorityLevelById(id);
      setLevelData(level);
      setLoading(false);
    }
    fetchLevel();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ServicePriorityLevelForm type="edit" data={levelData} />
    </div>
  );
}
