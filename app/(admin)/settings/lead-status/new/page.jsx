// @/app/(admin)/settings/lead-status/new/page.jsx

"use client";

import LeadStatusForm from "@/components/settingsForms/LeadStatusForm";

export default function NewLeadStatusPage() {
  return (
    <div>
      <LeadStatusForm type="create" />
    </div>
  );
}
