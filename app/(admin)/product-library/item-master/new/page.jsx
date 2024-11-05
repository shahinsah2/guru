// @/app/(admin)/product-library/item-master/new/page.jsx

"use client";

import ItemMasterForm from "@/components/productLibraryForms/ItemMasterForm";

export default function NewItemMasterPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ItemMasterForm type="create" />
    </div>
  );
}
