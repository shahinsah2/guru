// @/app/(admin)/product-library/product-categories/new/page.jsx

"use client";

import ProductCategoryForm from "@/components/productLibraryForms/ProductCategoryForm";

export default function NewProductCategoryPage() {
  return (
    <div>
      <ProductCategoryForm type="create" />
    </div>
  );
}
