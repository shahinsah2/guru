// @/app/(admin)/settings/roles/new/page.jsx

"use client";

import RolesForm from "@/components/settingsForms/RolesForm";

export default function NewRolePage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <RolesForm type="create" />
    </div>
  );
}
