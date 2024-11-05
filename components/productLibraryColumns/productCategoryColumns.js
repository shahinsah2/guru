// @/components/productLibraryColumns/productCategoryColumns.js

"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProductCategory } from "@/actions/productLibrary/productCategoryActions";
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

const checkPermissions = (roles, moduleName, permissionKey) => {
    for (const role of roles) {
      const module = role.module_access?.find(
        (mod) => mod.module_name === moduleName
      );
      if (module && module.permissions[permissionKey]) {
        return true;
      }
    }
    return false;
  };

export const columns = [
  {
    accessorKey: "category_code",
    header: "Category Code",
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "active_status",
    header: "Active Status",
    cell: ({ row }) => (
      <span>{row.original.active_status ? "Active" : "Inactive"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const userPermissions = useUserPermissions();
      const canEdit = checkPermissions(userPermissions, "Product Category", "can_edit");
      const canDelete = checkPermissions(userPermissions, "Product Category", "can_delete");

      const onEdit = () => {
        router.push(`/product-library/product-categories/${row.original._id}`);
      };

      const onDelete = async () => {
        await deleteProductCategory(row.original._id);
        toast.success("Product Category deleted successfully!");
        router.refresh();
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
              {canEdit && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
              {canDelete && <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export const CreateNewProductCategoryButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Product Category", "can_add");
  const router = useRouter();

  return (
    <div className="flex justify-end mb-1">
      {canAdd && (
        <Button className="bg-blue-500 text-white" onClick={() => router.push("/product-library/product-categories/new")}>
          Create New Category
        </Button>
      )}
    </div>
  );
};
