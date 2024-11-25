"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteService } from "@/actions/operation/serviceAction";

export const columns = [
  {
    accessorKey: "z",
    header: "Product Image",
    cell: ({ row }) => (
      row.index + 1,
      <div className="flex justify-center">
        <img
          src={row.original.image || "/avatar.png"} // Placeholder if no image
          alt="Product"
          className="w-16 h-16 object-cover border rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "product_id",
    header: "Product ID",
  },
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "order_no",
    header: "Order No",
  },
  {
    accessorKey: "client_id",
    header: "Client ID",
  },
  {
    accessorKey: "amc",
    header: "AMC",
    cell: ({ row }) => <span>{row.original.amc ? "Yes" : "No"}</span>,
  },
  {
    accessorKey: "sale_date",
    header: "Sale Date",
    cell: ({ row }) => new Date(row.original.sale_date).toLocaleDateString(),
  },
  {
    accessorKey: "client_name",
    header: "Client Name",
  },
  {
    accessorKey: "service_head",
    header: "Service Head",
  },
  {
    accessorKey: "service_staff",
    header: "Service Staff",
  },
  {
    accessorKey: "service_receive_data",
    header: "Service Receive Data",
  },
  {
    accessorKey: "start_date_time",
    header: "Start Date & Time",
    cell: ({ row }) => new Date(row.original.start_date_time).toLocaleString(),
  },
  {
    accessorKey: "end_date_time",
    header: "End Date & Time",
    cell: ({ row }) => new Date(row.original.end_date_time).toLocaleString(),
  },
  {
    accessorKey: "task_duration",
    header: "Task Duration",
    cell: ({ row }) => `${row.original.task_duration} mins`, // Assuming task duration is in minutes
  },
  {
    accessorKey: "expense",
    header: "Expense",
    cell: ({ row }) => `$${row.original.expense.toFixed(2)}`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

      const onEdit = () => router.push(`/operation/service/${row.original._id}`);
      const onDelete = async () => {
        try {
          await deleteService(row.original._id);
          toast.success("Delivery Challan deleted successfully!");
          setIsDeleteConfirmOpen(false);
          router.refresh();
        } catch {
          toast.error("Failed to delete Delivery Challan.");
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
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
                <h3 className="text-lg font-medium">Delete Confirmation</h3>
                <p className="mt-2 text-sm">Are you sure you want to delete this Delivery Challan?</p>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                  <Button className="bg-red-500 text-white" onClick={onDelete}>Yes, Delete</Button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
];

// Component to render the "Create New Product" button
export const CreateNewServiceButton = () => {
  const router = useRouter();
  return (
    <div className="flex justify-end mb-1">
      <Button className="bg-blue-500 text-white" onClick={() => router.push("/operation/service/new")}>
        Create New Service
      </Button>
    </div>
  );
};
