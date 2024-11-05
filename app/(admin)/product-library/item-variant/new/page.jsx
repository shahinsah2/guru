// @/app/(admin)/product-library/item-variant/new/page.jsx

"use client";

import ItemVariantForm from "@/components/productLibraryForms/ItemVariantForm";

export default function NewItemVariantPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ItemVariantForm type="create" />
    </div>
  );
}
