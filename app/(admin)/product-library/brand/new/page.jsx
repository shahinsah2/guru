// @/app/(admin)/product-library/brand/new/page.jsx

"use client";

import BrandForm from "@/components/productLibraryForms/BrandForm";

export default function NewBrandPage() {
  return (
    <div>
      <BrandForm type="create" />
    </div>
  );
}
