// @/app/(admin)/settings/order-checklist/page.jsx

"use server";

import { getOrderChecklists } from "@/actions/settings/orderChecklistActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewOrderChecklistButton } from "@/components/columns/orderChecklistColumns";

export default async function OrderChecklistsPage() {
  const checklists = await getOrderChecklists();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewOrderChecklistButton />
      <DataTable columns={columns} data={checklists} />
    </div>
  );
}
