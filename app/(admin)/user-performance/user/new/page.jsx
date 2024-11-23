// @/app/(admin)/user-performance/new/page.jsx

"use client";

import UserPerformanceForm from "@/components/userPerformanceForms/UserPerformanceForm";

export default function NewUserPerformancePage() {
  return (
    <div>
      <UserPerformanceForm type="create" />
    </div>
  );
}
