// @/app/(admin)/settings/cities/page.jsx

"use server";

import { getCities } from "@/actions/settings/cityActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewCityButton } from "@/components/columns/cityColumns";

export default async function CitiesPage() {
  const cities = await getCities();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewCityButton />
      <DataTable columns={columns} data={cities} />
    </div>
  );
}
