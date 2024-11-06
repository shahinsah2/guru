// @/app/(admin)/settings/terms/new/page.jsx

"use client";

import TermsForm from "@/components/settingsForms/TermsForm";

export default function NewTermsPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <TermsForm type="create" />
    </div>
  );
}
