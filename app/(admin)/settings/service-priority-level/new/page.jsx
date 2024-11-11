// @/app/(admin)/settings/service-priority-level/new/page.jsx

"use client";

import ServicePriorityLevelForm from "@/components/settingsForms/ServicePriorityLevelForm";

export default function NewServicePriorityLevelPage() {
  return (
    <div>
      <ServicePriorityLevelForm type="create" />
    </div>
  );
}
