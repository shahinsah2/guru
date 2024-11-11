// @/app/(admin)/product-library/item-variant/new/page.jsx

"use client";

import ItemVariantForm from "@/components/productLibraryForms/ItemVariantForm";

export default function NewItemVariantPage() {
  return (
    <div >
      <ItemVariantForm type="create" />
    </div>
  );
}
