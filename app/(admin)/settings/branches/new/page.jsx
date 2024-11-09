// @/app/(admin)/settings/branches/new/page.jsx

"use client";

import BranchForm from "@/components/settingsForms/BranchForm";

export default function NewBranchPage() {
  return (
    <div>
      <BranchForm type="create" />
    </div>
  );
}
