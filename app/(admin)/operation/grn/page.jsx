import { getGrn } from "@/actions/operation/grnAction"
import {columns, CreateNewGrnButton } from "@/components/operationColumn/grnColumn";
import { DataTable } from "@/components/DataTable";


export default async function NewGrnPage(){
    const grn = await getGrn();
    return(
        <div>
        <CreateNewGrnButton />
        <DataTable columns={columns}  data={grn}/>
        </div>
        
    )
}