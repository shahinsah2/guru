"use server"
import { getServiceStatuses } from '@/actions/serviceStatusActions';
import { currentUser } from '@clerk/nextjs/server';
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewServiceStatusButton } from "@/components/columns/serviceStatusColumns";

export default async function ServiceStatusPage() {
  const user = await currentUser();

  if (!user) return {};

  const serviceStatuses = await getServiceStatuses();

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewServiceStatusButton />
      <DataTable columns={columns} data={serviceStatuses} />
    </div>
  );
}
