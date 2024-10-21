// app/(admin)/settings/user/page.jsx (Server Component)
import { getUserPermissions } from '@/actions/getUserPermissions';
import { getUsers, getDepartments, getRoles, getBranches } from '@/actions/dataFetchActions';
import UserPageClient from './UserPageClient'; // Import the client component

export default async function UserPage() {
  // Fetch user permissions on the server
  const userPermissions = await getUserPermissions();

  // Fetch the data
  const [users, departments, roles, branches] = await Promise.all([
    getUsers(),
    getDepartments(),
    getRoles(),
    getBranches()
  ]);

  // Simplify the data to avoid warnings
  const simplifiedUsers = users.map(user => ({
    _id: user._id.toString(), // Convert ObjectId to string
    first_name: user.first_name,
    last_name: user.last_name,
    login_id: user.login_id,
    emailid: user.emailid,
    phone_number: user.phone_number,
    active_status: user.active_status,
    roles: user.roles.map(role => role.role_name), // Extract role names only
    departments: user.departments.map(dept => dept.department_name), // Extract department names only
    branches: user.branches.map(branch => branch.branch_name), // Extract branch names only
    address: user.address ? {
      pincode: user.address.pincode,
      country: user.address.country,
      state: user.address.state,
      city: user.address.city
    } : {}
  }));

  const simplifiedDepartments = departments.map(dept => ({
    _id: dept._id.toString(), // Convert ObjectId to string
    department_name: dept.department_name
  }));

  const simplifiedRoles = roles.map(role => ({
    _id: role._id.toString(), // Convert ObjectId to string
    role_name: role.role_name
  }));

  const simplifiedBranches = branches.map(branch => ({
    _id: branch._id.toString(), // Convert ObjectId to string
    branch_name: branch.branch_name
  }));

  return (
    <div>
      {/* Pass the simplified data to the client component */}
      <UserPageClient
        userPermissions={userPermissions}
        users={simplifiedUsers}
        departments={simplifiedDepartments}
        roles={simplifiedRoles}
        branches={simplifiedBranches}
      />
    </div>
  );
}
