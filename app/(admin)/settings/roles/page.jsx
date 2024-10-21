// app/(admin)/settings/role/page.jsx (Server Component)
import { getAllRoles } from '@/actions/roleActions';
import Table from '@/components/Table';
import Image from 'next/image';
import Link from 'next/link';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';

const columns = [
  { header: 'Role Name', accessor: 'role_name' },
  { header: 'Department Name', accessor: 'department_name' },
  { header: 'Status', accessor: 'active_status' },
  { header: 'Actions', accessor: 'action' },
];

export default async function RolePage() {
  // Fetch the roles data
  const roles = await getAllRoles();

  // Map roles to have department names
  const mappedRoles = roles.map((role) => ({
    ...role,
    department_name: role.department ? role.department.department_name : 'No Department',
    active_status: role.active_status ? 'Active' : 'Inactive',
  }));

  // Log the roles with populated data for debugging
  console.log('====================================');
  console.log('Populated Roles:', JSON.stringify(mappedRoles, null, 2));
  console.log('====================================');

  // Render each row of the table
  const renderRow = (item) => (
    <tr key={item._id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'>
      <td>{item.role_name}</td>
      <td>{item.department_name}</td>
      <td>{item.active_status}</td>
      <td>
        <div className='flex items-center gap-2'>
          <Link href={`/roles/${item._id}`}>
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
        <h1 className='hidden md:block text-lg font-semibold'>All Roles</h1>
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
      <Table columns={columns} renderRow={renderRow} data={mappedRoles} />
      {/* Pagination */}
      <Pagination />
    </div>
  );
}
