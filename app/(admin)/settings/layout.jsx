// @/app/(admin)/settings/layout.jsx

'use client';

import Link from 'next/link';
import { useState, useEffect, createContext } from 'react';
import { useUser } from '@clerk/nextjs';

// Create a context to share user permissions
export const PermissionsContext = createContext();

export default function SettingsLayout({ children }) {
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState('User');
  const [userPermissions, setUserPermissions] = useState({
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });

  // Fetch user roles and permissions
  useEffect(() => {
    if (clerkUser?.username) {
      const fetchUserPermissions = async () => {
        try {
          const userRes = await fetch(`/api/user-by-username?username=${clerkUser.username}`);
          const currentUser = await userRes.json();

          const userRoles = currentUser?.roles || [];
          const roleIds = userRoles.map((role) => role._id);

          // Fetch roles by their IDs using the new API
          const rolesRes = await fetch('/api/role-by-ids', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roleIds }),
          });

          const roleData = await rolesRes.json();

          // Find 'Users' module access permissions
          let permissions = { canAdd: false, canEdit: false, canDelete: false };
          roleData.forEach((role) => {
            const userModule = role.module_access.find(module => module.module_name === 'Users');
            if (userModule) {
              permissions = {
                canAdd: userModule.can_add || permissions.canAdd,
                canEdit: userModule.can_edit || permissions.canEdit,
                canDelete: userModule.can_delete || permissions.canDelete,
              };
            }
          });

          setUserPermissions(permissions);
        } catch (error) {
          console.error('Error fetching user permissions:', error);
        }
      };

      fetchUserPermissions();
    }
  }, [clerkUser]);

  return (
    <PermissionsContext.Provider value={userPermissions}>
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-100 border-r">
          <nav className="flex flex-col py-4 space-y-4">
            <Link href="/settings/user">
              <span
                className={`cursor-pointer px-4 py-2 text-lg font-medium ${
                  activeTab === 'User' ? 'bg-indigo-100' : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('User')}
              >
                User
              </span>
            </Link>
            <Link href="/settings/roles">
              <span
                className={`cursor-pointer px-4 py-2 text-lg font-medium ${
                  activeTab === 'Roles' ? 'bg-indigo-100' : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('Roles')}
              >
                Roles
              </span>
            </Link>
            <Link href="/settings/department">
              <span
                className={`cursor-pointer px-4 py-2 text-lg font-medium ${
                  activeTab === 'Department' ? 'bg-indigo-100' : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('Department')}
              >
                Department
              </span>
            </Link>
            <Link href="/settings/branch">
              <span
                className={`cursor-pointer px-4 py-2 text-lg font-medium ${
                  activeTab === 'Branch' ? 'bg-indigo-100' : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('Branch')}
              >
                Branch
              </span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </PermissionsContext.Provider>
  );
}
