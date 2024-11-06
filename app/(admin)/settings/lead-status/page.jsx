// @/app/(admin)/settings/lead-status/page.jsx



import { getLeadStatuses } from "@/actions/settings/leadStatusActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewLeadStatusButton } from "@/components/columns/leadStatusColumns";

export default async function LeadStatusPage() {
  const leadStatuses = await getLeadStatuses();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewLeadStatusButton />
      <DataTable columns={columns} data={leadStatuses} />
    </div>
  );
}
