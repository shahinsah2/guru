// @/app/(admin)/settings/lead-status/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import LeadStatusForm from "@/components/settingsForms/LeadStatusForm";
import { getLeadStatusById } from "@/actions/settings/leadStatusActions";
import { useRouter } from "next/navigation";

export default function EditLeadStatusPage({ params }) {
  const { id } = params;
  const [leadStatusData, setLeadStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeadStatus() {
      const leadStatus = await getLeadStatusById(id);
      setLeadStatusData(leadStatus);
      setLoading(false);
    }
    fetchLeadStatus();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
      <LeadStatusForm type="edit" data={leadStatusData} />
    </div>
  );
}
