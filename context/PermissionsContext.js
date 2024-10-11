// @/context/PermissionsContext.js

import { createContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

// Create the context
export const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const { user: clerkUser } = useUser();
  const [userPermissions, setUserPermissions] = useState({
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });

  useEffect(() => {
    if (clerkUser?.username) {
      const fetchUserPermissions = async () => {
        try {
          console.log('Fetching user data for:', clerkUser.username);
          const userRes = await fetch(`/api/user-by-username?username=${clerkUser.username}`);
          const currentUser = await userRes.json();
          console.log('Fetched user:', currentUser);

          const roleIds = currentUser.roles.map((role) => role._id);

          console.log('Role IDs:', roleIds);

          const rolesRes = await fetch('/api/role-by-ids', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleIds }),
          });

          const roleData = await rolesRes.json();
          console.log('Role data:', roleData);

          let permissions = { canAdd: false, canEdit: false, canDelete: false };

          roleData.forEach((role) => {
            const userModule = role.module_access.find((module) => module.module_name === 'Users');
            if (userModule) {
              permissions = {
                canAdd: userModule.can_add || permissions.canAdd,
                canEdit: userModule.can_edit || permissions.canEdit,
                canDelete: userModule.can_delete || permissions.canDelete,
              };
            }
          });

          console.log('Resolved permissions:', permissions);
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
      {children}
    </PermissionsContext.Provider>
  );
};
