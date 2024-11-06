// @/app/(admin)/settings/tax-list/page.jsx

"use server";

import { getTaxLists } from "@/actions/settings/taxListActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewTaxListButton } from "@/components/columns/taxListColumns";

export default async function TaxListPage() {
  const taxLists = await getTaxLists();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewTaxListButton />
      <DataTable columns={columns} data={taxLists} />
    </div>
  );
}