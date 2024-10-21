// @/app/(admin)/settings/department/page.jsx
import { getAllDepartments } from '@/actions/departmentActions';
import Table from '@/components/Table';
import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';

// Define the columns for the department table
const columns = [
  { header: 'Department Name', accessor: 'department_name' },
  { header: 'Description', accessor: 'description' },
  { header: 'Status', accessor: 'active_status' },
  { header: 'Actions', accessor: 'action' },
];

export default async function DepartmentPage() {
  // Fetch the departments data
  const departments = await getAllDepartments();

  // Map departments to include active status as a readable value
  const mappedDepartments = departments.map((department) => ({
    ...department,
    active_status: department.active_status ? 'Active' : 'Inactive',
  }));

  // Log the departments for debugging
  console.log('====================================');
  console.log('Populated Departments:', JSON.stringify(mappedDepartments, null, 2));
  console.log('====================================');

  // Render each row of the table
  const renderRow = (item) => (
    <tr key={item._id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'>
      <td>{item.department_name}</td>
      <td>{item.description || 'No Description'}</td>
      <td>{item.active_status}</td>
      <td>
        <div className='flex items-center gap-2'>
          <Link href={`/departments/${item._id}`}>
            <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky'>
              <Image src={'/update.png'} alt='Update' width={16} height={16} className='bg-blue-500'/>
            </button>
          </Link>
          <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple'>
            <Image src={'/delete.png'} alt='Delete' width={16} height={16}/>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white p-4 rounded-md m-4 mt-0 flex-1'>
      {/* Top */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Departments</h1>
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
      <Table columns={columns} renderRow={renderRow} data={mappedDepartments} />
      {/* Pagination */}
      <Pagination />
    </div>
  );
}
