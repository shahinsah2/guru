// @/app/(admin)/settings/order-checklist/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import OrderChecklistForm from "@/components/settingsForms/OrderChecklistForm";
import { getOrderChecklistById } from "@/actions/settings/orderChecklistActions";
import { useRouter } from "next/navigation";

export default function EditOrderChecklistPage({ params }) {
  const { id } = params;
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChecklist() {
      const checklist = await getOrderChecklistById(id);
      setChecklistData(checklist);
      setLoading(false);
    }
    fetchChecklist();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <OrderChecklistForm type="edit" data={checklistData} />
    </div>
  );
}
