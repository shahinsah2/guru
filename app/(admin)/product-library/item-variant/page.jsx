// @/app/(admin)/product-library/item-variant/page.jsx

"use server";

import { getItemVariants } from "@/actions/productLibrary/itemVariantActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewItemVariantButton } from "@/components/productLibraryColumns/itemVariantColumns";

export default async function ItemVariantPage() {
  const itemVariants = await getItemVariants();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewItemVariantButton />
      <DataTable columns={columns} data={itemVariants} />
    </div>
  );
}
