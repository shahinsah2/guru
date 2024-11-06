// @/app/(admin)/settings/countries/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import CountryForm from "@/components/settingsForms/CountryForm";
import { getCountryById } from "@/actions/settings/countryActions";
import { useRouter } from "next/navigation";

export default function EditCountryPage({ params }) {
  const { id } = params;
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountry() {
      const country = await getCountryById(id);
      setCountryData(country);
      setLoading(false);
    }
    fetchCountry();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <CountryForm type="edit" data={countryData} />
    </div>
  );
}
