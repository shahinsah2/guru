

//    InvoiceForm


"use server";

import { getInvoice } from "@/actions/operation/invoiceAction";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewInvoiceButton } from "@/components/operationColumn/invoiceColumn";

export default async function AssetPage() {
  const assets = await getInvoice();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewInvoiceButton />
      <DataTable columns={columns} data={assets} />
    </div>
  );
}









