// app/(admin)/settings/user/layout.jsx (Server Component)
import { getUserPermissions } from '@/actions/getUserPermissions';
import UserPage from './page';

export default async function UserLayout({}) {
  // Fetch user permissions on the server
  const userPermissions = await getUserPermissions();

  return (
    <div>
      {/* Pass userPermissions to the client component */}
      <UserPage userPermissions={userPermissions} />
    </div>
  );
}
