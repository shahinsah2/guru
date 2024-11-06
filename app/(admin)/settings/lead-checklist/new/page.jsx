// @/app/(admin)/settings/lead-checklist/new/page.jsx

"use client";

import LeadChecklistForm from "@/components/settingsForms/LeadChecklistForm";

export default function NewLeadChecklistPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <LeadChecklistForm type="create" />
    </div>
  );
}
