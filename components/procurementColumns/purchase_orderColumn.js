'use client';

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePo } from '@/actions/procurement/purchase_orderAction';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserPermissions } from "@/context/UserPermissionsContext";


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

// Separate cell components for using hooks properly
const MoveToNextCell = ({ row }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start">
      <p className="text-gray-700 mb-2">{row.original.move_to_next || " "}</p>
      <Button
        variant="solid"
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => router.push("/inventory/view-product")}
      >
        View Products
      </Button>
    </div>
  );
};

const ActionsCell = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(userPermissions, "Purchase_order", "can_edit");
  const canDelete = checkPermissions(userPermissions, "Purchase_order", "can_delete");

  const onEdit = () => router.push(`/procurement/purchase_order/${row.original._id}`);
  const onDelete = async () => {
    try {
      await deletePo(row.original._id);
      toast.success("Purchase deleted successfully!");
      setIsDeleteConfirmOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete purchase.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {canEdit && (
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          )}
          
          {canDelete && (
            <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>Delete</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
            <h3 className="text-lg font-medium">Delete Confirmation</h3>
            <p className="mt-2 text-sm">Are you sure you want to delete this purchase?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
              <Button className="bg-red-500 text-white" onClick={onDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Columns definition
export const columns = [
  { accessorKey: "po_id", header: "Po ID" },
  { accessorKey: "po_quotation_id", header: "Po Quotatin Id" },
  { accessorKey: "po_date", header: "Po Date" },
  { accessorKey: "po_owner", header: "Po Owner" },
  { accessorKey: "supplier", header: "Supplier" },
  { accessorKey: "supplier_number", header: "Supplier Number" },
  { accessorKey: "total_cost", header: "Total Cost" },
  { accessorKey: "product_qty", header: "Product Qty" },
  {
    accessorKey: "move_to_next",
    header: "Move to Next",
    cell: MoveToNextCell,
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
];

// Create New PO Button
export const CreateNewPOButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Purchase_order", "can_add");
  const router = useRouter();

  if (!canAdd) {
    return null;
  }

  return (
    <div className="flex justify-end mb-1">
      <Button className="bg-blue-500 text-white" onClick={() => router.push("/procurement/purchase_order/new")}>
        Create New PO
      </Button>
    </div>
  );
};
