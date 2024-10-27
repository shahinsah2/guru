"use server"
import { getStates } from '@/actions/stateActions';
import { currentUser } from '@clerk/nextjs/server';
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewStateButton } from "@/components/columns/stateColumns";

export default async function StatePage() {
  const user = await currentUser();

  if (!user) return {};

  const states = await getStates();

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewStateButton />
      <DataTable columns={columns} data={states} />
    </div>
  );
}
