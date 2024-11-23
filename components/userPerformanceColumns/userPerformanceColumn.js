"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserPerformance } from "@/actions/user-performance/userPerformanceActions"; 
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

// Utility function for permission checks
const checkPermissions = (roles, moduleName, permissionKey) => {
  for (const role of roles) {
    const foundModule = role.module_access?.find(
      (mod) => mod.module_name === moduleName
    );
    if (foundModule && foundModule.permissions[permissionKey]) {
      return true;
    }
  }
  return false;
};

// Actions Component
const Actions = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(userPermissions, "UserPerformance", "can_edit");
  const canDelete = checkPermissions(userPermissions, "UserPerformance", "can_delete");

  const onEdit = () => {
    router.push(`/user-performance/user/${row.original._id}`);
  };

  const onDelete = async () => {
    try {
      await deleteUserPerformance(row.original._id);
      toast.success("User performance record deleted successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to delete user performance record.");
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

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
            <h3 className="text-lg font-medium">Delete Confirmation</h3>
            <p className="mt-2 text-sm">
              Are you sure you want to delete this record?
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

// Column Definitions
export const columns = [
  {
    accessorKey: "user_code",
    header: "User Code",
  },
  {
    accessorKey: "user_name",
    header: "User Name",
  },
  {
    accessorKey: "role.role_name",
    header: "Role",
    cell: ({ row }) => row.original.role?.role_name || "N/A",
  },
  {
    accessorKey: "department.department_name",
    header: "Department",
    cell: ({ row }) => row.original.department?.department_name || "N/A",
  },
  {
    accessorKey: "joining_date",
    header: "Joining Date",
    cell: ({ row }) =>
      row.original.joining_date
        ? new Date(row.original.joining_date).toLocaleDateString()
        : "N/A",
  },
  {
    accessorKey: "performance_score",
    header: "Performance (%)",
    cell: ({ row }) => `${row.original.performance_score || 0}%`,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

// Create New User Performance Button
export const CreateNewUserPerformanceButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Users", "can_add");
  console.log(canAdd, "aaaaadddddddddddddddddd");
  console.log(userPermissions, "ppppppppppppppppppppp");
  
  const router = useRouter();

  if (!canAdd) {
    return null;
  }

  return (
    <div className="flex justify-end mb-1">
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/user-performance/user/new")}
      >
        Create New User Performance
      </Button>
    </div>
  );
};
