// @/app/(admin)/product-library/brand/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import BrandForm from "@/components/productLibraryForms/BrandForm";
import { getBrandById } from "@/actions/productLibrary/brandActions";

export default function UpdateBrandPage({ params }) {
  const { id } = params;
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrand() {
      const brand = await getBrandById(id);
      setBrandData(brand);
      setLoading(false);
    }
    fetchBrand();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <BrandForm type="edit" data={brandData} />
    </div>
  );
}
