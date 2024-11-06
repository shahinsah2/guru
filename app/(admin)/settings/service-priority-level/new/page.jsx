// @/app/(admin)/settings/service-priority-level/new/page.jsx

"use client";

import ServicePriorityLevelForm from "@/components/settingsForms/ServicePriorityLevelForm";

export default function NewServicePriorityLevelPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ServicePriorityLevelForm type="create" />
    </div>
  );
}
