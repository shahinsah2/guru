// @/app/(admin)/product-library/product-template/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import ProductTemplateForm from "@/components/productLibraryForms/ProductTemplateForm";
import { getProductTemplateById } from "@/actions/productLibrary/productTemplateActions";

export default function UpdateProductTemplatePage({ params }) {
  const { id } = params;
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplate() {
      const template = await getProductTemplateById(id);
      setTemplateData(template);
      setLoading(false);
    }
    fetchTemplate();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <ProductTemplateForm type="edit" data={templateData} />
    </div>
  );
}
