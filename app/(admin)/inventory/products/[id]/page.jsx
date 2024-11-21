"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/inventoryForm/ProductForm";
import { getProductById } from "@/actions/inventory/productActions";

export default function UpdateProductPage({ params }) {
  const { id } = params;
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const product = await getProductById(id);
      setProductData(product);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="">
      <ProductForm type="edit" data={productData} />
    </div>
  );
}
