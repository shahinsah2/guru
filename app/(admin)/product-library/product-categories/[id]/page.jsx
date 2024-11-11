// @/app/(admin)/product-library/product-categories/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import ProductCategoryForm from "@/components/productLibraryForms/ProductCategoryForm";
import { getProductCategoryById } from "@/actions/productLibrary/productCategoryActions";

export default function UpdateProductCategoryPage({ params }) {
  const { id } = params;
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      const category = await getProductCategoryById(id);
      setCategoryData(category);
      setLoading(false);
    }
    fetchCategory();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div >
      <ProductCategoryForm type="edit" data={categoryData} />
    </div>
  );
}
