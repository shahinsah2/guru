// app/(admin)/settings/order-checklists/page.jsx

"use server"
import { getOrderChecklists } from '@/actions/orderChecklistActions'
import { currentUser } from '@clerk/nextjs/server'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewOrderChecklistButton } from "@/components/columns/orderChecklistColumns"

export default async function OrderChecklistsPage() {
  const user = await currentUser()

  if (!user) return {}

  const orderChecklists = await getOrderChecklists()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewOrderChecklistButton />
      <DataTable columns={columns} data={orderChecklists} />
    </div>
  )
}
