"use server";

import { getPurchase } from '@/actions/procurement/purchaseAction';
import { DataTable } from '@/components/DataTable';
import { columns, CreateNewPrButton } from '@/components/procurementColumns/purchaseColumns';

export default async function PurchasePage() { // Make this function async
    
    const purchase = await getPurchase(); // Await the server action
    return (
        <div>
            <CreateNewPrButton />
            <DataTable columns={columns} data={purchase} />
        </div>
    );
}


