// @/app/(admin)/product-library/product-categories/page.jsx

"use server";

import { getProductCategories } from "@/actions/productLibrary/productCategoryActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewProductCategoryButton } from "@/components/productLibraryColumns/productCategoryColumns";

export default async function ProductCategoryPage() {
  const productCategories = await getProductCategories();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewProductCategoryButton />
      <DataTable columns={columns} data={productCategories} />
    </div>
  );
}
