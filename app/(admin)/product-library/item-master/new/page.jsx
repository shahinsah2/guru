// @/app/(admin)/product-library/item-master/new/page.jsx

"use client";

import ItemMasterForm from "@/components/productLibraryForms/ItemMasterForm";

export default function NewItemMasterPage() {
  return (
    <div>
      <ItemMasterForm type="create" />
    </div>
  );
}
