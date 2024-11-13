// @/app/(admin)/inventory/group/page.jsx

"use server";

import { getGroups } from "@/actions/inventory/groupActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewGroupButton } from "@/components/inventoryColumns/groupColumns";

export default async function GroupPage() {
  const groups = await getGroups();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewGroupButton />
      <DataTable columns={columns} data={groups} />
    </div>
  );
}
