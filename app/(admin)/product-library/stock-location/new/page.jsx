// @/app/(admin)/product-library/stock-location/new/page.jsx

"use client";

import StockLocationForm from "@/components/productLibraryForms/StockLocationForm";

export default function NewStockLocationPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <StockLocationForm type="create" />
    </div>
  );
}
