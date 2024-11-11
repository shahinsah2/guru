// @/app/(admin)/settings/states/new/page.jsx

"use client";

import StateForm from "@/components/settingsForms/StateForm";

export default function NewStatePage() {
  return (
    <div>
      <StateForm type="create" />
    </div>
  );
}
