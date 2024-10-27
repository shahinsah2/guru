// app/(admin)/settings/taxes/page.jsx

"use server"
import { getTaxLists } from '@/actions/taxListActions'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewTaxListButton } from "@/components/columns/taxListColumns"

export default async function TaxesPage() {
  const taxes = await getTaxLists()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewTaxListButton />
      <DataTable columns={columns} data={taxes} />
    </div>
  )
}
