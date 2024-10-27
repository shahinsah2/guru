"use server"
import { getServicePriorityLevels } from "@/actions/servicePriorityLevelActions"
import { currentUser } from "@clerk/nextjs/server"
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewServicePriorityLevelButton } from "@/components/columns/servicePriorityLevelColumns"

export default async function ServicePriorityLevelsPage() {
  const user = await currentUser()

  if (!user) return {}

  const servicePriorityLevels = await getServicePriorityLevels()

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewServicePriorityLevelButton />
      <DataTable columns={columns} data={servicePriorityLevels} />
    </div>
  )
}
