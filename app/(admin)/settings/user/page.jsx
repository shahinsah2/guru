// app/(admin)/settings/user/page.jsx (Server Component)
import { getUserPermissions } from '@/actions/getUserPermissions';
import { getUsers,getUsersCount, getUsersByLoginId,getAllRoles,getAllDepartments,getAllBranches } from '@/actions/dataFetchActions';
// import { getAllRoles } from '@/actions/roleActions';
// import { getAllDepartments } from '@/actions/departmentActions';
// import { getAllBranches } from '@/actions/branchActions';
import Table from '@/components/Table';
import Image from 'next/image';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';
import FormModal from '@/components/settingsForms/FormModal';
import { ITEM_PER_PAGE } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';

const moduleName = "Users";

export default async function UserPage({ searchParams }) {
  // Extract the 'page' query parameter
  const { page } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const user = await currentUser(); // Get the logged-in user

  if (!user) return {};
 

  // Fetch user permissions on the server
  const userPermissions = await getUserPermissions();

  // Fetch roles, departments, and branches using server actions
  const [rolesOptions, departmentsOptions, branchesOptions] = await Promise.all([
    getAllRoles(),
    getAllDepartments(),
    getAllBranches(),
  ]);

  // Fetch the users data with pagination
  const [logonId,users, totalUsers] = await Promise.all([
    getUsersByLoginId(user.username),
    getUsers({ skip: (currentPage - 1) * ITEM_PER_PAGE, limit: ITEM_PER_PAGE }),
    getUsersCount(),
  ]);

    // Log the data to see the structure
    console.log('Logon ID:', logonId);
    console.log('Users:', users);
    console.log('Roles:', rolesOptions);
    console.log('Departments:', departmentsOptions);
    console.log('Branches:', branchesOptions);

  // Define the columns for the table
  const columns = [
    { header: 'Login ID', accessor: 'login_id', className: 'hidden md:table-cell' },
    { header: 'First Name', accessor: 'first_name' },
    { header: 'Email', accessor: 'emailid', className: 'hidden md:table-cell' },
    { header: 'Roles', accessor: 'roles', className: 'hidden md:table-cell' },
    { header: 'Departments', accessor: 'departments', className: 'hidden lg:table-cell' },
    { header: 'Status', accessor: 'active_status', className: 'hidden lg:table-cell' },
    { header: 'Actions', accessor: 'action' },
  ];

  // Render each row of the table
  const renderRow = (item) => (
    <tr key={item._id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'>
      <td className='flex items-center p-1 gap-3'>
        <h3 className='font-semibold'>{item.login_id}</h3>
      </td>
      <td className='hidden md:table-cell'>{item.first_name}</td>
      <td className='hidden lg:table-cell'>{item.emailid}</td>
      <td className='hidden md:table-cell'>
        {item.roles.map((role) => role.role_name).join(', ') || 'No Roles'}
      </td>
      <td className='hidden md:table-cell'>
        {item.departments.map((dept) => dept.department_name).join(', ') || 'No Departments'}
      </td>
      <td className='hidden lg:table-cell'>{item.active_status ? 'Active' : 'Inactive'}</td>
      <td>
        <div className='flex items-center gap-2'>
          <FormModal 
            table="Users" 
            type="update" 
            data={JSON.stringify(item)} 
            rolesOptions={rolesOptions} 
            departmentsOptions={departmentsOptions} 
            branchesOptions={branchesOptions} 
          />
          <FormModal table="Users" type="delete" id={item._id.toString()} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white p-4 rounded-md m-4 mt-0 flex-1'>
      {/* Top */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Users</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src={'/filter.png'} alt='Filter' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src={'/sort.png'} alt='Sort' width={14} height={14} />
            </button>            
            <FormModal 
              table="Users" 
              type="create" 
              rolesOptions={rolesOptions} 
              departmentsOptions={departmentsOptions} 
              branchesOptions={branchesOptions} 
            />
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={users} />
      {/* Pagination */}
      <Pagination page={currentPage} count={totalUsers} />
    </div>
  );
}
