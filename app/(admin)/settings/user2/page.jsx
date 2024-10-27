// app/(admin)/settings/user/page.jsx (Server Component)
"use server"
import { getUserPermissions } from '@/actions/getUserPermissions';
import { getUsers,getUsersCount, getUsersByLoginId,getAllRoles,getAllDepartments,getAllBranches } from '@/actions/dataFetchActions';
import Table from '@/components/Table';
import Image from 'next/image';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';
import FormModal from '@/components/settingsForms/FormModal';
import { ITEM_PER_PAGE } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';

import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns/usersColumns";

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

  // // Render each row of the table
  // const renderRow = (item) => (
  //   <tr key={item._id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'>
  //     <td className='flex items-center p-1 gap-3'>
  //       <h3 className='font-semibold'>{item.login_id}</h3>
  //     </td>
  //     <td className='hidden md:table-cell'>{item.first_name}</td>
  //     <td className='hidden lg:table-cell'>{item.emailid}</td>
  //     <td className='hidden md:table-cell'>
  //       {item.roles.map((role) => role.role_name).join(', ') || 'No Roles'}
  //     </td>
  //     <td className='hidden md:table-cell'>
  //       {item.departments.map((dept) => dept.department_name).join(', ') || 'No Departments'}
  //     </td>
  //     <td className='hidden lg:table-cell'>{item.active_status ? 'Active' : 'Inactive'}</td>
  //     <td>
  //       <div className='flex items-center gap-2'>
  //         <FormModal 
  //           table="Users" 
  //           type="update" 
  //           data={JSON.stringify(item)} 
  //           rolesOptions={rolesOptions} 
  //           departmentsOptions={departmentsOptions} 
  //           branchesOptions={branchesOptions} 
  //         />
  //         <FormModal table="Users" type="delete" id={item._id.toString()} />
  //       </div>
  //     </td>
  //   </tr>
  // );

  return (
    <div className='bg-white p-4 rounded-md m-4 mt-0 flex-1'>
      {/* Top */}
      <DataTable columns={columns} data={users} />      
    </div>
  );
}
