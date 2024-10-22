import { getAllBranches } from '@/actions/branchActions';
import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';

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

  // Render each row of the table
  const renderRow = (item) => (
    <tr key={item._id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'>
      <td className='flex items-center p-1 gap-3'>
        <h3 className='font-semibold'>{item.branch_name}</h3>
      </td>
      <td>{item.address.pincode}</td>
      <td>{item.address.country}</td>
      <td>{item.address.state}</td>
      <td>{item.address.city}</td>
      <td>
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
      </td>
    </tr>
  );

  // Prepare data for DataTable
  const dataWithActions = branches.map(item => ({
    ...item,
    action: renderRow(item), // Add action buttons to data
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
      <Table columns={columns} renderRow={renderRow} data={dataWithActions} />
      {/* Pagination */}
      <Pagination page={1} count={branches.length} />
    </div>
  );
}
