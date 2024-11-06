// @/app/(admin)/settings/branches/new/page.jsx

"use client";

import BranchForm from "@/components/settingsForms/BranchForm";

export default function NewBranchPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <BranchForm type="create" />
    </div>
  );
}
