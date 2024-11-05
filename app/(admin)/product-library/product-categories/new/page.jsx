// @/app/(admin)/product-library/product-categories/new/page.jsx

"use client";

import ProductCategoryForm from "@/components/productLibraryForms/ProductCategoryForm";

export default function NewProductCategoryPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ProductCategoryForm type="create" />
    </div>
  );
}
