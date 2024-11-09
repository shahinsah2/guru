"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRole } from "@/actions/roleActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserPermissions } from "@/context/UserPermissionsContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Function to check module access permissions
const checkPermissions = (roles, moduleName, permissionKey) => {
  for (const role of roles) {
    const roleModule = role.module_access?.find(
      (mod) => mod.module_name === moduleName
    );
    if (roleModule && roleModule.permissions[permissionKey]) {
      return true; // Return true immediately if any role has the permission
    }
  }
  return false; // Return false only if no role has the permission
};

// ActionsCell component for handling actions like edit and delete
const ActionsCell = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(userPermissions, "Roles", "can_edit");
  const canDelete = checkPermissions(userPermissions, "Roles", "can_delete");

  const onEdit = () => {
    router.push(`/settings/roles/${row.original._id}`);
  };

  const onDelete = async () => {
    try {
      await deleteRole(row.original._id);
      toast.success("Role deleted successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to delete role.");
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
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
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
            <p className="mt-2 text-sm">
              Are you sure you want to delete this role?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button className="bg-red-500 text-white" onClick={onDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const columns = [
  {
    accessorKey: "role_name",
    header: "Role Name",
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) =>
      row.original.department ? row.original.department.department_name : "N/A",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "active_status",
    header: "Status",
    cell: ({ row }) => (
      <span>{row.original.active_status ? "Active" : "Inactive"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// CreateNewRoleButton component with permission check
export const CreateNewRoleButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Roles", "can_add");
  const router = useRouter();

  if (!canAdd) {
    return null; // Hide button if user lacks can_add permission
  }

  return (
    <div className="flex justify-end mb-1">
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/settings/roles/new")}
      >
        Create New Role
      </Button>
    </div>
  );
};
