"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAsset } from "@/actions/productLibrary/assetActions";
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

// Function to check permissions
const checkPermissions = (roles, moduleName, permissionKey) => {
  for (const role of roles) {
    const assetModule = role.module_access?.find(
      (mod) => mod.module_name === moduleName
    );
    if (assetModule && assetModule.permissions[permissionKey]) {
      return true;
    }
  }
  return false;
};

// ActionsCell component
const ActionsCellContent = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(userPermissions, "Asset", "can_edit");
  const canDelete = checkPermissions(userPermissions, "Asset", "can_delete");

  const onEdit = () => {
    router.push(`/product-library/assets/${row.original._id}`);
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteAsset(row.original._id);
      toast.success("Asset deleted successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to delete asset.");
    }
    setIsDeleteConfirmOpen(false);
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
              Are you sure you want to delete this asset?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button className="bg-red-500 text-white" onClick={onDeleteConfirm}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Columns definition
export const columns = [
  { id: "sl_no", header: "Sl. No", cell: ({ row }) => row.index + 1 },
  { accessorKey: "item_name", header: "Item Name" },
  { accessorKey: "item_type", header: "Item Type" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "warranty", header: "Warranty" },
  { accessorKey: "warranty_time", header: "Warranty Time" },
  {
    accessorKey: "active_status",
    header: "Status",
    cell: ({ row }) => (
      <span>{row.original.active_status ? "Active" : "Inactive"}</span>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionsCellContent row={row} />,
  },
];

// CreateNewAssetButton component
export const CreateNewAssetButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Asset", "can_add");
  const router = useRouter();

  if (!canAdd) return null;

  return (
    <div className="flex justify-end mb-1">
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/product-library/assets/new")}
      >
        Create New Asset
      </Button>
    </div>
  );
};
