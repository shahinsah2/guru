// @/app/(admin)/settings/lead-checklist/page.jsx

"use server";

import { getLeadChecklists } from "@/actions/settings/leadChecklistActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewLeadChecklistButton } from "@/components/columns/leadChecklistColumns";

export default async function LeadChecklistPage() {
  const checklists = await getLeadChecklists();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewLeadChecklistButton />
      <DataTable columns={columns} data={checklists} />
      
    </div>
  );
}
