// @/app/(admin)/settings/branches/page.jsx

"use server";

import { getBranches } from "@/actions/settings/branchActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewBranchButton } from "@/components/columns/branchColumns";

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewBranchButton />
      <DataTable columns={columns} data={branches} />
    </div>
  );
}
