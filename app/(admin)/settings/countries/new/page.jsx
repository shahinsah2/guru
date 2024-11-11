// @/app/(admin)/settings/countries/new/page.jsx

"use client";

import CountryForm from "@/components/settingsForms/CountryForm";

export default function NewCountryPage() {
  return (
    <div >
      <CountryForm type="create" />
    </div>
  );
}
