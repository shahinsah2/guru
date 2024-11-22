"use server";

import { getSupplier } from "@/actions/procurement/supplierAction"; 
import { DataTable } from '@/components/DataTable';
import { columns, CreateNewSupplierButton } from '@/components/procurementColumns/supplierColumn';

export default async function poSupplierPage() { // Make this function async
  
    const purchase = await getSupplier(); // Await the server action
    return (
        <div>
            <CreateNewSupplierButton />
            <DataTable columns={columns} data={purchase} />
        </div>
    );
}

