// @/app/(admin)/product-library/assets/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import AssetForm from "@/components/productLibraryForms/AssetForm";
import { getAssetById } from "@/actions/productLibrary/assetActions";

export default function UpdateAssetPage({ params }) {
  const { id } = params;
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAsset() {
      const asset = await getAssetById(id);
      setAssetData(asset);
      setLoading(false);
    }
    fetchAsset();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <AssetForm type="edit" data={assetData} />
    </div>
  );
}
