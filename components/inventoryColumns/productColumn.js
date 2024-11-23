"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProduct } from "@/actions/inventory/productActions";
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
  const canEdit = checkPermissions(userPermissions, "Product", "can_edit");
  const canDelete = checkPermissions(
    userPermissions,
    "Product",
    "can_delete"
  );

  const onEdit = () => router.push(`/inventory/products/${row.original._id}`);
  const onDelete = async () => {
    try {
      await deleteProduct(row.original._id);
      toast.success("Product deleted successfully!");
      setIsDeleteConfirmOpen(false);
      router.push(router.asPath); // Refresh the page
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-start">
          <p className="text-gray-700 mb-2">
            {row.original.move_to_next || " "}
          </p>
          <Button
            variant="solid"
            className="bg-blue-500 text-white hover:bg-blue-600 w-auto px-4 py-2 text-sm"
            onClick={() => router.push("/inventory/view-product")} // Adjusted path to root level
          >
            View Product
          </Button>
        </div>

        <div>
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
        </div>
      </div>
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
            <h3 className="text-lg font-medium">Delete Confirmation</h3>
            <p className="mt-2 text-sm">
              Are you sure you want to delete this product?
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
    accessorKey: "z",
    header: "Product Image",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Image
          src={row.original.image || "/avatar.png"} // Placeholder if no image
          alt="Product"
          width={64} // Adjust width as needed
          height={64} // Adjust height as needed
          className="w-16 h-16 object-cover border rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "product_qty",
    header: "Product QTY",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "brand",
    header: "Brand",
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
    accessorKey: "purchase_price",
    header: "Purchase Price",
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
    cell: ActionCell, // Use the ActionCell component here
  },
];

// Component to render the "Create New Product" button
export const CreateNewProductButton = () => {
  const userPermissions = useUserPermissions();
  const canAdd = checkPermissions(userPermissions, "Product", "can_add");


  const router = useRouter();

  if (!canAdd) {
    return null;
  }
  return (
    <div className="flex justify-end mb-1">
      <Button
        className="bg-blue-500 text-white"
        onClick={() => router.push("/inventory/products/new")}
      >
        Create New Product
      </Button>
    </div>
  );
};
