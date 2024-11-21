import Sidebar from './_components/Sidebar';
import { UserPermissionsProvider } from "@/context/UserPermissionsContext";


export default async function CRMLayout({ children }) {

  return (
    <div className="flex h-screen">
     
      <Sidebar />

      <main className="flex-1 p-8">
      <UserPermissionsProvider>
        {children}
      </UserPermissionsProvider>
      </main>
    </div>
  );
}
