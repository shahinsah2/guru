// @/app/(admin)/product-library/brand/new/page.jsx

"use client";

import BrandForm from "@/components/productLibraryForms/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <BrandForm type="create" />
    </div>
  );
}
