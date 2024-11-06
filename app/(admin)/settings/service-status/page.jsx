// @/app/(admin)/settings/service-status/page.jsx

"use server";

import { getServiceStatuses } from "@/actions/serviceStatusActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewServiceStatusButton } from "@/components/columns/serviceStatusColumns";

export default async function ServiceStatusPage() {
  const statuses = await getServiceStatuses();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewServiceStatusButton />
      <DataTable columns={columns} data={statuses} />
    </div>
  );
}
