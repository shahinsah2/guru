// @/app/(admin)/settings/states/new/page.jsx

"use client";

import StateForm from "@/components/settingsForms/StateForm";

export default function NewStatePage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <StateForm type="create" />
    </div>
  );
}
