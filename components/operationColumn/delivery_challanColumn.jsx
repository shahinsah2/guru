'use client';

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDeliveryChallan } from '@/actions/operation/delivery_challanAction';
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

// Component for "Move to Next" cell
const MoveToNextCell = ({ row }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start">
      <p className="text-gray-700 mb-2">{row.original.move_to_next || " "}</p>
      <Button
        variant="solid"
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => router.push("/operation/invoice/new")}
      >
        Add purchase orders
      </Button>
    </div>
  );
};

// Component for "Actions" cell
const ActionsCell = ({ row }) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onEdit = () => router.push(`/operation/delivery_challan/${row.original._id}`);
  const onDelete = async () => {
    try {
      await deleteDeliveryChallan(row.original._id);
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
};

export const columns = [
  { accessorKey: "dc_id", header: "DC ID" },
  { accessorKey: "order_id", header: "Order ID" },
  { accessorKey: "quotation_id", header: "Quotation ID" },
  { accessorKey: "dc_date", header: "DC Date" },
  { accessorKey: "company", header: "Company" },
  {
    accessorKey: "move_to_next",
    header: "Move to Next",
    cell: (props) => <MoveToNextCell {...props} />,
  },
  {
    accessorKey: "active_status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.active_status ? "Active" : "Inactive"}</span>,
  },
  {
    id: "actions",
    cell: (props) => <ActionsCell {...props} />,
  },
];

export const CreateNewDeliveryChallanButton = () => {
  const router = useRouter();
  return (
    <div className="flex justify-end mb-1">
      <Button className="bg-blue-500 text-white" onClick={() => router.push("/operation/delivery_challan/new")}>
        Create New DC
      </Button>
    </div>
  );
};
