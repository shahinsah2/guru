// @/app/(admin)/settings/service-priority-level/page.jsx

"use server";

import { getServicePriorityLevels } from "@/actions/settings/servicePriorityLevelActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewServicePriorityLevelButton } from "@/components/columns/servicePriorityLevelColumns";

export default async function ServicePriorityLevelPage() {
  const levels = await getServicePriorityLevels();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewServicePriorityLevelButton />
      <DataTable columns={columns} data={levels} />
    </div>
  );
}
