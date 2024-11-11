// @/app/(admin)/product-library/product-template/new/page.jsx

"use client";

import ProductTemplateForm from "@/components/productLibraryForms/ProductTemplateForm";

export default function NewProductTemplatePage() {
  return (
    <div>
      <ProductTemplateForm type="create" />
    </div>
  );
}
