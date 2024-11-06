// @/app/(admin)/settings/cities/new/page.jsx

"use client";

import CityForm from "@/components/settingsForms/CityForm";

export default function NewCityPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <CityForm type="create" />
    </div>
  );
}
