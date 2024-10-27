// app/(admin)/settings/user/page.jsx (Server Component)
"use server"
import { getUserPermissions } from '@/actions/getUserPermissions';
import { getUsersCount, getUsersByLoginId,getAllRoles,getAllDepartments,getAllBranches } from '@/actions/dataFetchActions';
import { currentUser } from '@clerk/nextjs/server';

import { DataTable } from "@/components/DataTable";
import { columns, CreateNewUserButton  } from "@/components/columns/usersColumns";
import { getUsers } from '@/actions/userActions';

const moduleName = "Users";

export default async function UserPage({ searchParams }) {
  // Extract the 'page' query parameter
  const { page } = searchParams;
  
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
    getUsers(),    
  ]);


  return (
    <div className='bg-white p-1 rounded-md mt-0 flex-1'>
      {/* Top */}
      <CreateNewUserButton />
      <DataTable columns={columns} data={users} />      
    </div>
  );
}
