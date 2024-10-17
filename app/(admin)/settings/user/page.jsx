// app/(admin)/settings/user/page.jsx (Server Component)
import { getUserPermissions } from '@/actions/getUserPermissions';
import UserPageClient from './UserPageClient'; // Import the client component

export default async function UserPage() {
  // Fetch user permissions on the server
  const userPermissions = await getUserPermissions();

  return (
    <div>
      {/* Pass userPermissions to the client component */}
      <UserPageClient userPermissions={userPermissions} />
    </div>
  );
}
