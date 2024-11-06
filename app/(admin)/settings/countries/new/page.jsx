// @/app/(admin)/settings/countries/new/page.jsx

"use client";

import CountryForm from "@/components/settingsForms/CountryForm";

export default function NewCountryPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <CountryForm type="create" />
    </div>
  );
}
