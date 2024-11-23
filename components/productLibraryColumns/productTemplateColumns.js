"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProductTemplate } from "@/actions/productLibrary/productTemplateActions";
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
import Image from "next/image";
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

const ActionCell = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const userPermissions = useUserPermissions();
  const canEdit = checkPermissions(userPermissions, "Product Template", "can_edit");
  const canDelete = checkPermissions(
    userPermissions,
    "Product Template",
    "can_delete"
  );

  const onEdit = () => {
    router.push(`/product-library/product-template/${row.original._id}`);
  };

  const onDelete = async () => {
    try {
      await deleteProductTemplate(row.original._id);
      toast.success("Product Template deleted successfully!");
      setIsDeleteConfirmOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete product template.");
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
              Are you sure you want to delete this product template?
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
    accessorKey: "image",
    header: "Product Image",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Image
          src={row.original.image || "/avatar.png"} // Placeholder if no image
          width={64}
          height={64}
          alt="Product"
          className="w-16 h-16 object-cover border rounded"
        />
      </div>
    ),
  },
  { accessorKey: "product_name", header: "Product Name" },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category || "N/A",
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => row.original.brand || "N/A",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="truncate max-w-[150px]">
        {row.original.description || "No description"}
      </div>
    ),
  },
  {
    id: "specifications",
    header: "Specifications",
    cell: ({ row }) => {
      const specs = row.original.specifications || {};
      return (
        <ul className="text-sm">
          {Object.entries(specs).map(([key, spec]) => (
            <li key={key}>
              <strong className="capitalize">{key}:</strong>{" "}
              {spec?.brand?.brand_name || "N/A"} - {spec?.type?.type || "N/A"}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "active_status",
    header: "Active Status",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.active_status ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            Inactive
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export const CreateNewProductTemplateButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Product Template", "can_add");


  const router = useRouter();

  if (!canAdd) {
    return null;
  }

  return (
    <div className="flex justify-end mb-4">
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/product-library/product-template/new")}
      >
        Create Product Template
      </Button>
    </div>
  );
};
