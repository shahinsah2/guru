// app/(admin)/settings/roles/page.jsx
"use server"
import { getDepartments } from '@/actions/departmentActions';
import { getRoles } from '@/actions/roleActions';
import { currentUser } from '@clerk/nextjs/server';
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewRoleButton } from "@/components/columns/rolesColumns";

export default async function RolesPage() {
  const user = await currentUser();

  if (!user) return {};

  const [departmentsOptions, roles] = await Promise.all([
    getDepartments(),
    getRoles(),
  ]);

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewRoleButton />
      <DataTable columns={columns} data={roles} />
    </div>
  );
}
