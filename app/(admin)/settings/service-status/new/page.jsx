// @/app/(admin)/settings/service-status/new/page.jsx

"use client";

import ServiceStatusForm from "@/components/settingsForms/ServiceStatusForm";

export default function NewServiceStatusPage() {
  return (
    <div>
      <ServiceStatusForm type="create" />
    </div>
  );
}
