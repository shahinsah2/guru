// @/app/(admin)/settings/terms/new/page.jsx

"use client";

import TermsForm from "@/components/settingsForms/TermsForm";

export default function NewTermsPage() {
  return (
    <div>
      <TermsForm type="create" />
    </div>
  );
}
