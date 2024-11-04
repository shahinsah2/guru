// app/(admin)/settings/layout.jsx

import Sidebar from './components/Sidebar';
import { UserPermissionsProvider } from "@/context/UserPermissionsContext";


export default async function SettingsLayout({ children }) {

  return (
    <div className="flex h-screen">
      {/* Sidebar with links */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8">
      <UserPermissionsProvider>
        {children}
      </UserPermissionsProvider>
      </main>
    </div>
  );
}
