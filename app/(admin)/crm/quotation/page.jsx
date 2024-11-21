"use server";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewQuotationButton } from "@/components/columns/quotationColumns";
import { getQuotations } from "@/actions/quotationActions";
import { currentUser } from "@clerk/nextjs/server";

export default async function QuotationPage() {
  const user = await currentUser();
  if (!user) return null;

  const quotations = await getQuotations();

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewQuotationButton />
      <DataTable columns={columns} data={quotations} />
    </div>
  );
}
