// @/app/(admin)/product-library/brand/page.jsx

"use server";

import { getBrands } from "@/actions/productLibrary/brandActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewBrandButton } from "@/components/productLibraryColumns/brandColumns";

export default async function BrandPage() {
  const brands = await getBrands();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewBrandButton />
      <DataTable columns={columns} data={brands} />
    </div>
  );
}
