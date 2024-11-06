// @/app/(admin)/settings/lead-checklist/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import LeadChecklistForm from "@/components/settingsForms/LeadChecklistForm";
import { getLeadChecklistById } from "@/actions/settings/leadChecklistActions";
import { useRouter } from "next/navigation";

export default function EditLeadChecklistPage({ params }) {
  const { id } = params;
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChecklist() {
      const checklist = await getLeadChecklistById(id);
      setChecklistData(checklist);
      setLoading(false);
    }
    fetchChecklist();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <LeadChecklistForm type="edit" data={checklistData} />
    </div>
  );
}
