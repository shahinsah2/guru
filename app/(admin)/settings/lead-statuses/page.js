// app/(admin)/settings/lead-statuses/page.jsx

"use server"
import { getLeadStatuses } from '@/actions/leadStatusActions'
import { currentUser } from '@clerk/nextjs/server'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewLeadStatusButton } from "@/components/columns/leadStatusColumns"

export default async function LeadStatusesPage() {
  const user = await currentUser()

  if (!user) return {}

  const leadStatuses = await getLeadStatuses()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewLeadStatusButton />
      <DataTable columns={columns} data={leadStatuses} />
    </div>
  )
}
