// app/(admin)/settings/lead-checklists/page.jsx

"use server"
import { getLeadChecklists } from '@/actions/leadChecklistActions'
import { currentUser } from '@clerk/nextjs/server'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewLeadChecklistButton } from "@/components/columns/leadChecklistColumns"

export default async function LeadChecklistsPage() {
  const user = await currentUser()

  if (!user) return {}

  const leadChecklists = await getLeadChecklists()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewLeadChecklistButton />
      <DataTable columns={columns} data={leadChecklists} />
    </div>
  )
}
