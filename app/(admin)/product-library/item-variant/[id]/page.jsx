// @/app/(admin)/product-library/item-variant/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import ItemVariantForm from "@/components/productLibraryForms/ItemVariantForm";
import { getItemVariantById } from "@/actions/productLibrary/itemVariantActions";

export default function UpdateItemVariantPage({ params }) {
  const { id } = params;
  const [variantData, setVariantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVariant() {
      const variant = await getItemVariantById(id);
      setVariantData(variant);
      setLoading(false);
    }
    fetchVariant();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div >
      <ItemVariantForm type="edit" data={variantData} />
    </div>
  );
}
