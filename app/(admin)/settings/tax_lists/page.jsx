import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import { getAllTaxes } from "@/actions/taxListActions";
import { DataTable } from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import FormModal from '@/components/settingsForms/FormModal'; // Added for dynamic modals

const ITEM_PER_PAGE = 5; // Number of items per page

// Function to get the total tax count
const getTaxesCount = async () => {
  const allTaxes = await getAllTaxes(); // Fetch all taxes
  return allTaxes.length; // Return the total number of taxes
};

// Function to get paginated taxes
const getPaginatedTaxes = async (skip, limit) => {
  const allTaxes = await getAllTaxes(); // Assuming this fetches all taxes
  return allTaxes.slice(skip, skip + limit); // Return paginated taxes
};

export default async function TaxListPage({ searchParams }) {
  const { page } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const [taxLists, totalTaxes] = await Promise.all([
    getPaginatedTaxes((currentPage - 1) * ITEM_PER_PAGE, ITEM_PER_PAGE),
    getTaxesCount(),
  ]);

  const columns = [
    { header: 'SI No', accessorKey: '_id' }, 
    { header: 'Tax Name', accessorKey: 'tax_name' },
    { header: 'CGST (%)', accessorKey: 'percentage_cgst' },
    { header: 'SGST (%)', accessorKey: 'percentage_sgst' },
    { header: 'Active Status', accessorKey: 'active_status' },
    { header: 'Actions', accessorKey: 'action' },
  ];

  const tableData = taxLists.map((item, index) => ({
    _id: (currentPage - 1) * ITEM_PER_PAGE + index + 1, // Calculate SI No
    tax_name: item.tax_name,
    percentage_cgst: item.percentage_cgst,
    percentage_sgst: item.percentage_sgst,
    active_status: item.active_status ? 'Active' : 'Inactive',
    action: (
      <div className='flex items-center gap-2'>
        <FormModal table="Taxes" type="update" data={JSON.stringify(item)} />
        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple'>
          <Image src={'/delete.png'} alt='Delete' width={16} height={16} />
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
            <FormModal table="Taxes" type="create" />
          </div>
        </div>
      </div>
      {/* List */}
      <DataTable columns={columns} data={tableData} />
      {/* Pagination */}
      <Pagination page={currentPage} count={totalTaxes} />
    </div>
  );
}
