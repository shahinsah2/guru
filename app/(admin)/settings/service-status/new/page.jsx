// @/app/(admin)/settings/service-status/new/page.jsx

"use client";

import ServiceStatusForm from "@/components/settingsForms/ServiceStatusForm";

export default function NewServiceStatusPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ServiceStatusForm type="create" />
    </div>
  );
}
