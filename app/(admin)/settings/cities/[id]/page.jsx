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
    <div >
      <CityForm type="edit" data={cityData} />
    </div>
  );
}
