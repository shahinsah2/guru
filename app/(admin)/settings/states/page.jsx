// @/app/(admin)/settings/states/page.jsx

"use server";

import { getStates } from "@/actions/settings/stateActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewStateButton } from "@/components/columns/stateColumns";

export default async function StatesPage() {
  const states = await getStates();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewStateButton />
      <DataTable columns={columns} data={states} />
    </div>
  );
}
