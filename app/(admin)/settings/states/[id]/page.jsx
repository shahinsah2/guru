// @/app/(admin)/settings/states/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import StateForm from "@/components/settingsForms/StateForm";
import { getStateById } from "@/actions/settings/stateActions";
import { useRouter } from "next/navigation";

export default function EditStatePage({ params }) {
  const { id } = params;
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchState() {
      const state = await getStateById(id);
      setStateData(state);
      setLoading(false);
    }
    fetchState();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
      <StateForm type="edit" data={stateData} />
    </div>
  );
}
