// @/app/(admin)/settings/lead-status/new/page.jsx

"use client";

import LeadStatusForm from "@/components/settingsForms/LeadStatusForm";

export default function NewLeadStatusPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <LeadStatusForm type="create" />
    </div>
  );
}
