// @/app/(admin)/settings/roles/page.jsx

"use server";

import { getRoles } from "@/actions/roleActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewRoleButton } from "@/components/columns/rolesColumns";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewRoleButton />
      <DataTable columns={columns} data={roles} />
    </div>
  );
}
