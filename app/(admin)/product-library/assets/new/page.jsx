// @/app/(admin)/product-library/assets/new/page.jsx

"use client";

import AssetForm from "@/components/productLibraryForms/AssetForm";

export default function NewAssetPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <AssetForm type="create" />
    </div>
  );
}
