"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteStockLocation } from "@/actions/productLibrary/stockLocationActions";
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
    const mod = role.module_access?.find(
      (mod) => mod.module_name === moduleName
    );
    if (mod && mod.permissions[permissionKey]) {
      return true; // Return true immediately if any role has the permission
    }
  }
  return false; // Return false only if no role has the permission
};

// ActionsCell component for handling edit and delete actions
const ActionsCell = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(
    userPermissions,
    "Stock Location",
    "can_edit"
  );
  const canDelete = checkPermissions(
    userPermissions,
    "Stock Location",
    "can_delete"
  );

  const onEdit = () => {
    router.push(`/product-library/stock-location/${row.original._id}`);
  };

  const onDelete = async () => {
    try {
      await deleteStockLocation(row.original._id);
      toast.success("Stock Location deleted successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to delete stock location.");
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

// Column definition with the new ActionsCell component
export const columns = [
  {
    accessorKey: "stock_location_id",
    header: "Location ID",
  },
  {
    accessorKey: "stock_name",
    header: "Stock Name",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) =>
      `${row.original.address.street}, ${row.original.address.city}, ${row.original.address.state}`,
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
    cell: ActionsCell, // Use the ActionsCell component here
  },
];

// CreateNewStockLocationButton component with permission check
export const CreateNewStockLocationButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Stock Location", "can_add");
  const router = useRouter();

  if (!canAdd) {
    return null; // Hide button if user lacks can_add permission
  }

  return (
    <div className="flex justify-end mb-1">
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/product-library/stock-location/new")}
      >
        Create New Stock Location
      </Button>
    </div>
  );
};
