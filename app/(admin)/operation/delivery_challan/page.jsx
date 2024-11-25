

// @/app/(admin)/product-library/assets/page.jsx

"use server";

import { getDeliveryChallans } from "@/actions/operation/delivery_challanAction";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewDeliveryChallanButton } from "@/components/operationColumn/delivery_challanColumn";

export default async function AssetPage() {
  const assets = await getDeliveryChallans();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewDeliveryChallanButton />
      <DataTable columns={columns} data={assets} />
    </div>
  );
}
