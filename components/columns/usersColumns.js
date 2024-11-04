// @/components/columns/usersColumns.js
"use client";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/actions/userActions";
import { toast } from "react-toastify";
import { useState } from "react";
import { useUserPermissions } from "@/context/UserPermissionsContext";

// Function to check module access permissions
const checkPermissions = (roles, moduleName, permissionKey) => {
  for (const role of roles) {
    const module = role.module_access?.find(
      (mod) => mod.module_name === moduleName
    );
    if (module && module.permissions[permissionKey]) {
      return true; // Return true immediately if any role has the permission
    }
  }
  return false; // Return false only if no role has the permission
};

export const columns = [
  {
    accessorKey: "login_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Login ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "emailid",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <span>
        {row.original.roles.map((role) => role.role_name).join(", ") || "No Roles"}
      </span>
    ),
  },
  {
    accessorKey: "departments",
    header: "Departments",
    cell: ({ row }) => (
      <span>
        {row.original.departments.map((dept) => dept.department_name).join(", ") || "No Departments"}
      </span>
    ),
  },
  {
    accessorKey: "active_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.active_status ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
      const userPermissions = useUserPermissions();
      const canEdit = checkPermissions(userPermissions, "Users", "can_edit");
      const canDelete = checkPermissions(userPermissions, "Users", "can_delete");

      // Navigate to the edit page for the selected user
      const onEdit = () => {
        router.push(`/settings/user/${row.original._id}`);
      };

      // Function to delete the user
      const confirmDelete = async () => {
        try {
          await deleteUser(row.original._id);
          toast.success("User deleted successfully!");
          setIsDeleteConfirmOpen(false);
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete user. Please try again.");
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {canEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    Edit
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Render Delete Confirmation Popup */}
          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
                <h3 className="text-lg font-medium">Delete Confirmation</h3>
                <p className="mt-2 text-sm">Are you sure you want to delete this record?</p>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-red-500 text-white" onClick={confirmDelete}>
                    Yes, Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
];

// CreateNewUserButton component with permission check
export const CreateNewUserButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Users", "can_add");

  console.log('===userPermissions=====');
  console.log(userPermissions);
  console.log('=====canAdd==============');
  console.log(canAdd);
  console.log('====================================');

  const router = useRouter();

  if (!canAdd) {
    return null; // Hide button if user lacks canAdd permission
  }

  return (
    <div className="flex justify-end mb-1">
      <Button className="bg-blue-500 text-white" onClick={() => router.push("/settings/user/new")}>
        Create New User
      </Button>
    </div>
  );
};
