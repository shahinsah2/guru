// @/app/(admin)/product-library/item-master/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import ItemMasterForm from "@/components/productLibraryForms/ItemMasterForm";
import { getItemMasterById } from "@/actions/productLibrary/itemMasterActions";

export default function UpdateItemMasterPage({ params }) {
  const { id } = params;
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const item = await getItemMasterById(id);
      setItemData(item);
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ItemMasterForm type="edit" data={itemData} />
    </div>
  );
}
