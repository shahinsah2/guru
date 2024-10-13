// app/context/PermissionsProvider.jsx (server component)

import { getUserByUsername } from '@/actions/getUserByUsername';
import { getRolesByIds } from '@/actions/getRolesByIds';
import { currentUser } from '@clerk/nextjs/server';
import { ClientPermissionsProvider } from './PermissionsContext'; // Import the client-side provider

export default async function PermissionsProvider({ children }) {
  const user = await currentUser(); // Fetch the user from Clerk server-side

  let userPermissions = [];

  if (user?.username) {
    try {
      // Fetch the user by username
      const fetchedUser = await getUserByUsername(user.username);

      // Ensure roles exist before trying to extract their IDs
      if (fetchedUser?.roles?.length > 0) {
        // Fetch role permissions by role IDs
        const roleIds = fetchedUser.roles.map((role) => role._id);
        const roleDetails = await getRolesByIds(roleIds);

        // Log the full roleDetails to inspect the structure of module_access
        console.log('Full roleDetails:', JSON.stringify(roleDetails, null, 2));

        // Iterate over the roleDetails and extract the correct permissions from the `module_access` array
        userPermissions = roleDetails.map((role) => {
          const moduleAccessArray = role.module_access;

          // Check if moduleAccessArray exists and contains 'Users'
          if (moduleAccessArray && moduleAccessArray.length > 0) {
            const moduleAccess = moduleAccessArray.find(
              (module) => module.module_name === 'Users'
            );

            if (moduleAccess) {
              console.log("Found module access for 'Users':", moduleAccess);

              // Access the permissions via the _doc property of the Mongoose object
              const { can_add, can_edit, can_delete } = moduleAccess._doc;

              // Log the permissions to confirm access
              console.log('can_add:', can_add);
              console.log('can_edit:', can_edit);
              console.log('can_delete:', can_delete);

              // Return permissions based on the _doc values
              return {
                canAdd: can_add !== undefined ? can_add : false,
                canEdit: can_edit !== undefined ? can_edit : false,
                canDelete: can_delete !== undefined ? can_delete : false,
              };
            } else {
              console.log("'Users' module not found in module_access");
              return { canAdd: false, canEdit: false, canDelete: false };
            }
          } else {
            console.log("No module_access array found for role:", role.role_name);
            return { canAdd: false, canEdit: false, canDelete: false };
          }
        });

        console.log('==PermissionsProvider====');
        console.log(userPermissions);
        console.log('==PermissionsProvider===');
      } else {
        console.log("No roles found for user.");
      }
    } catch (error) {
      console.error('Error fetching user or roles:', error);
    }
  }

  // Pass the fetched permissions to the client-side provider
  return (
    <ClientPermissionsProvider value={userPermissions}>
      {children}
    </ClientPermissionsProvider>
  );
}
