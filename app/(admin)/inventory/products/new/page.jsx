// @/app/(admin)/settings/lead-checklist/new/page.jsx

"use client";

import ProductForm from "@/components/inventoryForm/ProductForm";

export default function NewProductsPage() {
  return (
    <div >
      <ProductForm type="create" />
    </div>
  );
}
