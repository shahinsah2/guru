// @/app/(admin)/settings/lead-checklist/new/page.jsx

"use client";

import LeadChecklistForm from "@/components/settingsForms/LeadChecklistForm";

export default function NewLeadChecklistPage() {
  return (
    <div >
      <LeadChecklistForm type="create" />
    </div>
  );
}
