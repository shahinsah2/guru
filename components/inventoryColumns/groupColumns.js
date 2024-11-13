"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteGroup } from "@/actions/inventory/groupActions";
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
import Image from 'next/image';

const buttonClass = "bg-blue-500 text-white hover:bg-blue-600";

const Actions = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onEdit = () => {
    router.push(`/inventory/group/${row.original._id}`);
  };

  const onDelete = async () => {
    try {
      await deleteGroup(row.original._id);
      toast.success("Group deleted successfully!");
      setIsDeleteConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to delete group: ${error.message || error}`);
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
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
            <h3 className="text-lg font-medium">Delete Confirmation</h3>
            <p className="mt-2 text-sm">
              Are you sure you want to delete this group?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
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
    id: "group_image",
    header: "Group Image",
    cell: () => (
      <div className="relative w-12 h-12">
        <Image
          src="/path-to-default-group-image.jpg"
          alt="Group"
          layout="fill"
          objectFit="cover"
        />
      </div>
    ),
  },
  { accessorKey: "group_name", header: "Group Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "active_status",
    header: "Status",
    cell: ({ row }) => (
      <span>{row.original.active_status ? "Active" : "Inactive"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

export const CreateNewGroupButton = () => {
  const router = useRouter();

  return (
    <div className="flex justify-end mb-1">
      <Button
        className={buttonClass}
        onClick={() => router.push("/inventory/group/new")}
      >
        Create New Group
      </Button>
    </div>
  );
};
