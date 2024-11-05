// @/app/(admin)/product-library/grade/page.jsx

"use server";

import { getGrades } from "@/actions/productLibrary/gradeActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewGradeButton } from "@/components/productLibraryColumns/gradeColumns";

export default async function GradePage() {
  const grades = await getGrades();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewGradeButton />
      <DataTable columns={columns} data={grades} />
    </div>
  );
}
