// @/app/(admin)/inventory/products/page.jsx

"use server";

import { getProducts } from "@/actions/inventory/productActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewProductButton } from "@/components/inventoryColumns/productColumn";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewProductButton />
      <DataTable columns={columns} data={products} />
    </div>
  );
}
