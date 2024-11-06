// @/app/settings/departments/new/page.js

"use client"

import DepartmentForm from "@/components/settingsForms/DepartmentForm";

export default function NewDepartmentPage() {
  return (
    <div className="p-6">
      <DepartmentForm type="create" />
    </div>
  );
}
