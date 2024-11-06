// @/app/(admin)/settings/tax-list/new/page.jsx

"use client";

import TaxListForm from "@/components/settingsForms/TaxListForm";

export default function NewTaxListPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <TaxListForm type="create" />
    </div>
  );
}