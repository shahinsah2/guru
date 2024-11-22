"use server";

import { getPo } from '@/actions/procurement/purchase_orderAction';
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewPOButton } from '@/components/procurementColumns/purchase_orderColumn';

export default async function ProductPage() {
  const products = await getPo();
  console.log(products);

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewPOButton />
      <DataTable columns={columns} data={products} />
    </div>
  );
}