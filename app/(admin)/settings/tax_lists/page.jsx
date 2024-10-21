
import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import { getAllTaxes } from "@/actions/taxListActions";
import { DataTable } from '@/components/DataTable';

// Define the columns for the tax list table
const columns = [
  { header: 'Tax Name', accessorKey: 'tax_name' },
  { header: 'CGST (%)', accessorKey: 'percentage_cgst' },
  { header: 'SGST (%)', accessorKey: 'percentage_sgst' },
  { header: 'Active Status', accessorKey: 'active_status' },
  { header: 'Actions', accessorKey: 'action' },
];

export default async function TaxListPage() {
  // Fetch the tax list data
  const taxLists = await getAllTaxes();


  // Prepare data for the table
  const tableData = taxLists.map(item => ({
    tax_name: item.tax_name,
    percentage_cgst: item.percentage_cgst,
    percentage_sgst: item.percentage_sgst,
    active_status: item.active_status ? 'Active' : 'Inactive',
    action: (
      <div className='flex items-center gap-2'>
        <Link href={`/tax_lists/${item._id}`}>
          <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky'>
            <Image src={'/update.png'} alt='Update' width={16} height={16} />
          </button>
        </Link>
        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple'>
          <Image src={'/delete.png'} alt='Delete' width={16} height={16}/>
        </button>
      </div>
    ),
  }));

  return (
    <div className='bg-white p-4 rounded-md m-4 mt-0 flex-1'>
      {/* Top */}
      <div className='flex items-center justify-between mb-4'>
        <h1 className='hidden md:block text-lg font-semibold'>All Tax Lists</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-gray'>
              <Image src={'/filter.png'} alt='Filter' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src={'/sort.png'} alt='Sort' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src={'/create.png'} alt='Create' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* List */}
      <DataTable columns={columns} data={tableData} />
      {/* Pagination */}
      {/* <Pagination /> Uncomment this if you have a pagination component */}
    </div>
  );
}
