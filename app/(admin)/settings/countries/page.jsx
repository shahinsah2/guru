// app/(admin)/settings/countries/page.jsx

"use server"
import { getCountries } from '@/actions/countryActions'
import { currentUser } from '@clerk/nextjs/server'
import { DataTable } from "@/components/DataTable"
import { columns, CreateNewCountryButton } from "@/components/columns/countryColumns"

export default async function CountriesPage() {
  const user = await currentUser()

  if (!user) return {}

  const countries = await getCountries()

  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      <CreateNewCountryButton />
      <DataTable columns={columns} data={countries} />
    </div>
  )
}
