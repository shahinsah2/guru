// @/app/(admin)/settings/terms/page.jsx

"use server";

import { getTermsAndConditions } from "@/actions/settings/termsAndConditionsActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewTermButton } from "@/components/columns/termsAndConditionsColumns";

export default async function TermsPage() {
  const terms = await getTermsAndConditions();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewTermButton />
      <DataTable columns={columns} data={terms} />
    </div>
  );
}
