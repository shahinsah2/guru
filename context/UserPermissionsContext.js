// @/context/UserPermissionsContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserByUsername } from "@/actions/userActions";

// Create context
const UserPermissionsContext = createContext();

// Provider component
export const UserPermissionsProvider = ({ children }) => {
  const { user, isLoaded } = useUser(); // Access Clerk user using useUser
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isLoaded || !user) return;

      try {
        const userData = await getUserByUsername(user.username);
        setPermissions(userData?.roles || []);
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [isLoaded, user]);

  if (loading || !permissions) {
    return <div>Loading permissions...</div>;
  }

  return (
    <UserPermissionsContext.Provider value={permissions}>
      {children}
    </UserPermissionsContext.Provider>
  );
};

// Custom hook for easy access to permissions
export const useUserPermissions = () => useContext(UserPermissionsContext);
