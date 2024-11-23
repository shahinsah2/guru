// @/app/(admin)/user-performance/page.jsx

"use server";

import { getUserPerformances } from "@/actions/user-performance/userPerformanceActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewUserPerformanceButton } from "@/components/userPerformanceColumns/userPerformanceColumn";

export default async function UserPerformancePage() {
  const userPerformances = await getUserPerformances();

  console.log(userPerformances,"Main page data sendinggggg");
  

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewUserPerformanceButton />
      <DataTable columns={columns} data={userPerformances} />
    </div>
  );
}
