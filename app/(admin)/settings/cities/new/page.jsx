// @/app/(admin)/settings/cities/new/page.jsx

"use client";

import CityForm from "@/components/settingsForms/CityForm";

export default function NewCityPage() {
  return (
    <div >
      <CityForm type="create" />
    </div>
  );
}
