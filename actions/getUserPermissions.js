// actions/getUserPermissions.js

import { currentUser } from '@clerk/nextjs/server';
import { getUserByUsername } from '@/actions/getUserByUsername';
import { getRolesByIds } from '@/actions/getRolesByIds';

export async function getUserPermissions() {
  const user = await currentUser(); // Get the logged-in user

  if (!user) return {}; // Return empty permissions if no user is logged in

  let userPermissions = {};

  const validPermissionKeys = [
    'can_add', 'can_edit', 'can_delete', 'can_activate', 'can_deactivate',
    'can_search', 'can_import', 'can_export', 'can_print', 'can_generate_pdf', 'can_logout'
  ];

  try {
    const fetchedUser = await getUserByUsername(user.username);

    if (fetchedUser?.roles?.length > 0) {
      const roleIds = fetchedUser.roles.map((role) => role._id);
      const roleDetails = await getRolesByIds(roleIds);

      roleDetails.forEach((role) => {
        role.module_access.forEach((module) => {
          const moduleName = module.module_name;
          if (!userPermissions[moduleName]) userPermissions[moduleName] = {};

          Object.entries(module.toObject()).forEach(([key, value]) => {
            if (validPermissionKeys.includes(key) && typeof value === 'boolean') {
              userPermissions[moduleName][key] = value;
            }
          });
        });
      });
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }

  return userPermissions; // Return the permissions object
}
