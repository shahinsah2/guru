// app/(admin)/settings/locations/page.jsx

"use server"
import { getLocations } from '@/actions/locationActions'
import { currentUser } from '@clerk/nextjs/server'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewLocationButton } from "@/components/columns/locationColumns"

export default async function LocationsPage() {
  const user = await currentUser()

  if (!user) return {}

  const locations = await getLocations()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewLocationButton />
      <DataTable columns={columns} data={locations} />
    </div>
  )
}
