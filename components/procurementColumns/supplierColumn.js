'use client';

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSupplier } from "@/actions/procurement/supplierAction";
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

// Component for actions cell
const ActionsCell = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(userPermissions, "Supplier", "can_edit");
  const canDelete = checkPermissions(
    userPermissions,
    "Supplier",
    "can_delete"
  );

  const onEdit = () => router.push(`/procurement/supplier/${row.original._id}`);
  const onDelete = async () => {
    try {
      await deleteSupplier(row.original._id); // Updated action
      toast.success("Supplier deleted successfully!");
      setIsDeleteConfirmOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete supplier.");
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
            <p className="mt-2 text-sm">Are you sure you want to delete this supplier?</p>
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
  { accessorKey: "supplier", header: "Supplier ID" },
  { accessorKey: "website", header: "Website" },
  { accessorKey: "emp_name", header: "Employee Name" },
  { accessorKey: "e_mail", header: "Email" },
  { accessorKey: "emp_mobile", header: "Mobile Number" },
  { accessorKey: "emp_office_num", header: "Office Number" },
  { accessorKey: "executive", header: "Executive" },
  {
    id: "actions",
    cell: ActionsCell, // Reference the component here
  },
];

// Create New Supplier Button
export const CreateNewSupplierButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Supplier", "can_add");


  const router = useRouter();

  if (!canAdd) {
    return null;
  }
  return (
    <div className="flex justify-end mb-1">
      <Button className="bg-blue-500 text-white" onClick={() => router.push("/procurement/supplier/new")}>
        Create New Supplier
      </Button>
    </div>
  );
};
