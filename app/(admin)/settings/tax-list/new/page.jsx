// @/app/(admin)/settings/tax-list/new/page.jsx

"use client";

import TaxListForm from "@/components/settingsForms/TaxListForm";

export default function NewTaxListPage() {
  return (
    <div>
      <TaxListForm type="create" />
    </div>
  );
}