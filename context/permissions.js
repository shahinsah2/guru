// @/context/permissions.js
import { getUserByUsername } from '@/actions/getUserByUsername';
import { getRolesByIds } from '@/actions/getRolesByIds';
import { PermissionsContext } from './PermissionsContext';

export async function PermissionsProviderServer({ children, clerkUser }) {
  if (!clerkUser?.username) {
    throw new Error('User is not authenticated');
  }

  try {
    // Fetch user by username from server actions
    const currentUser = await getUserByUsername(clerkUser.username);

    // Fetch roles based on user's roles
    const roleIds = currentUser.roles.map((role) => role._id);
    const roles = await getRolesByIds(roleIds);

    let permissions = { canAdd: false, canEdit: false, canDelete: false };

    // Process permissions based on module access
    roles.forEach((role) => {
      const userModule = role.module_access.find((module) => module.module_name === 'Users');
      if (userModule) {
        permissions = {
          canAdd: userModule.permissions.get('can_add') || permissions.canAdd,
          canEdit: userModule.permissions.get('can_edit') || permissions.canEdit,
          canDelete: userModule.permissions.get('can_delete') || permissions.canDelete,
        };
      }
    });

    // Pass permissions as context
    return (
      <PermissionsContext.Provider value={permissions}>
        {children}
      </PermissionsContext.Provider>
    );
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return <div>Error fetching permissions.</div>;
  }
}
