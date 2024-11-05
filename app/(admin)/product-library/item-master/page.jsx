// @/app/(admin)/product-library/item-master/page.jsx

"use server";

import { getItemMasters } from "@/actions/productLibrary/itemMasterActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewItemButton } from "@/components/productLibraryColumns/itemMasterColumns";

export default async function ItemMasterPage() {
  const items = await getItemMasters();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewItemButton />
      <DataTable columns={columns} data={items} />
    </div>
  );
}
