// @/app/(admin)/product-library/product-template/new/page.jsx

"use client";

import ProductTemplateForm from "@/components/productLibraryForms/ProductTemplateForm";

export default function NewProductTemplatePage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ProductTemplateForm type="create" />
    </div>
  );
}
