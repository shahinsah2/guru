// @/context/PermissionsContext.js
'use client';

import { createContext, useContext } from 'react';

// Create the PermissionsContext for client-side use
export const PermissionsContext = createContext(null);

// Create a custom hook to access the permissions
export const usePermissions = () => {
  return useContext(PermissionsContext);
};

// Client-side PermissionsProvider component
export function ClientPermissionsProvider({ value, children }) {
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}
