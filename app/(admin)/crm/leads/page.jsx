"use server";
import { getLeads } from '@/actions/leadsAction';
import { currentUser } from '@clerk/nextjs/server';
import { DataTable } from "@/components/DataTable";
import { columns as leadsColumns, CreateNewLeadButton } from "@/components/columns/leadsColumn";

export default async function LeadsPage() {
    const user = await currentUser();

    // Check if the user is authenticated
    if (!user) return null;

    // Fetch leads from the database
    const leads = await getLeads();
    console.log('Leads in Page:', leads); // Log leads for debugging

    return (
        <div className='bg-white p-1 rounded-md mt-0 flex-1'>
            {/* Button to create a new lead */}
            <CreateNewLeadButton />
            {/* DataTable component to display Leads */}
            <DataTable columns={leadsColumns} data={leads} />
        </div>
    );
}
