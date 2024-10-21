// @/app/(admin)/settings/branch/page.jsx
import { getAllBranches } from '@/actions/branchActions';
import DataTable from '@/components/DataTable'; // Import the DataTable component
import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';

// Define the columns for the branch table
const columns = [
  { header: 'Branch Name', accessor: 'branch_name' },
  { header: 'Pincode', accessor: 'address.pincode' },
  { header: 'Country', accessor: 'address.country' },
  { header: 'State', accessor: 'address.state' },
  { header: 'City', accessor: 'address.city' },
  { header: 'Actions', accessor: 'action' },
];

// Marking the component as server
export default async function BranchPage() {
  // Fetch the branches data
  const branches = await getAllBranches();

  // Log the branches for debugging
  console.log('====================================');
  console.log('Populated Branches:', JSON.stringify(branches, null, 2));
  console.log('====================================');

  // Render actions for the row
  const renderActions = (item) => (
    <div className='flex items-center gap-2'>
      <Link href={`/branches/${item._id}`}>
        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky'>
          <Image src={'/update.png'} alt='Update' width={16} height={16} />
        </button>
      </Link>
      <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple'>
        <Image src={'/delete.png'} alt='Delete' width={16} height={16} />
      </button>
    </div>
  );

  // Prepare data for DataTable
  const dataWithActions = branches.map(item => ({
    ...item,
    action: renderActions(item), // Add action buttons to data
  }));

  return (
    <div className='bg-white p-4 rounded-md m-4 mt-0 flex-1'>
      {/* Top */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Branches</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
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
      <DataTable columns={columns} data={dataWithActions} />
      {/* Pagination */}
      <Pagination />
    </div>
  );
}
