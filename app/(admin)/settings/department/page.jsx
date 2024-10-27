// app/(admin)/settings/departments/page.jsx

"use server"
import { getDepartments } from '@/actions/departmentActions'
import { currentUser } from '@clerk/nextjs/server'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewDepartmentButton } from "@/components/columns/departmentColumns"

export default async function DepartmentsPage() {
  const user = await currentUser()

  if (!user) return {}

  const departments = await getDepartments()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewDepartmentButton />
      <DataTable columns={columns} data={departments} />
    </div>
  )
}
