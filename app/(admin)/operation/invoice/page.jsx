

//    InvoiceForm


"use server";

import { getInvoice } from "@/actions/operation/invoiceAction";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewInvoiceButton } from "@/components/operationColumn/invoiceColumn";

export default async function AssetPage() {
  const assets = await getInvoice();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewInvoiceButton />
      <DataTable columns={columns} data={assets} />
    </div>
  );
}



// import React from 'react';

// function Page() {
//   return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600">
//       <div className="text-center p-10 bg-white/40 rounded-xl shadow-xl backdrop-blur-lg">
//         <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 animate-text mb-6">
//           ✨ Coming Soon ✨
//         </h1>
//         <p className="text-2xl text-white font-medium mb-6">
//           Something magical is on its way. Stay tuned!
//         </p>
//         <div className="flex justify-center">
//           <div className="w-16 h-16 border-t-4 border-white rounded-full animate-spin"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Page;







