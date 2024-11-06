// @/app/(admin)/settings/cities/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import CityForm from "@/components/settingsForms/CityForm";
import { getCityById } from "@/actions/settings/cityActions";
import { useRouter } from "next/navigation";

export default function EditCityPage({ params }) {
  const { id } = params;
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCity() {
      const city = await getCityById(id);
      setCityData(city);
      setLoading(false);
    }
    fetchCity();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <CityForm type="edit" data={cityData} />
    </div>
  );
}
