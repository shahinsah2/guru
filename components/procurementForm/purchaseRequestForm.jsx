"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createPurchaseRequest,
  updatePurchaseRequest,
} from "@/actions/procurement/purchaseRequestActions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

// Schema for validation
const schema = z.object({
  purchase_request_id: z.string().min(1, { message: "Purchase Request ID is required!" }),
  po_date: z.string().min(1, { message: "Purchase Order Date is required!" }),
  order_type: z.enum(["Sale", "Buy"], { message: "Order Type is required!" }),
  owner: z.string().min(1, { message: "Owner is required!" }),
  supplier: z.object({
    supplier_name: z.string().min(1, { message: "Supplier Name is required!" }),
    supplier_email: z.string().email({ message: "Valid Supplier Email is required!" }),
    supplier_number: z.string().min(1, { message: "Supplier Number is required!" }),
  }),
  total_quantity: z
    .number()
    .min(1, { message: "Total Quantity must be greater than 0!" }),
  additional_info: z
    .object({
      purchase_type: z.enum(["Buy", "Sale"]).optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export default function PurchaseRequestForm({ type, data }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      purchase_request_id: data?.purchase_request_id || "",
      po_date: data?.po_date || "",
      order_type: data?.order_type || "Buy",
      owner: data?.owner || "",
      supplier: data?.supplier || {
        supplier_name: "",
        supplier_email: "",
        supplier_number: "",
      },
      total_quantity: data?.total_quantity || 0,
      additional_info: data?.additional_info || { purchase_type: "", description: "" },
    },
  });

  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    const response = await (type === "create"
      ? createPurchaseRequest
      : updatePurchaseRequest)({
      ...formData,
      id: data?._id,
    });

    if (response && !response.success) {
      toast.error(response.message);
    } else {
      toast.success(
        `${
          type === "create" ? "Created" : "Updated"
        } purchase request successfully!`
      );
      router.push("/purchase");
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Purchase Request ID */}
      <div>
        <label>Purchase Request ID</label>
        <Input
          {...register("purchase_request_id")}
          placeholder="Enter Purchase Request ID"
        />
        {errors.purchase_request_id && <p>{errors.purchase_request_id.message}</p>}
      </div>

      {/* Purchase Order Date */}
      <div>
        <label>Purchase Order Date</label>
        <Input type="date" {...register("po_date")} />
        {errors.po_date && <p>{errors.po_date.message}</p>}
      </div>

      {/* Order Type */}
      <div>
        <label>Order Type</label>
        <select {...register("order_type")}>
          <option value="Buy">Buy</option>
          <option value="Sale">Sale</option>
        </select>
        {errors.order_type && <p>{errors.order_type.message}</p>}
      </div>

      {/* Owner */}
      {/* <div>
        <label>Owner</label>
        <Input {...register("owner")} placeholder="Enter Owner ID" />
        {errors.owner && <p>{errors.owner.message}</p>}
      </div> */}

      {/* Supplier Details */}
      <div>
        <label>Supplier Name</label>
        <Input
          {...register("supplier.supplier_name")}
          placeholder="Enter Supplier Name"
        />
        {errors.supplier?.supplier_name && <p>{errors.supplier.supplier_name.message}</p>}
      </div>
      <div>
        <label>Supplier Email</label>
        <Input
          type="email"
          {...register("supplier.supplier_email")}
          placeholder="Enter Supplier Email"
        />
        {errors.supplier?.supplier_email && <p>{errors.supplier.supplier_email.message}</p>}
      </div>
      <div>
        <label>Supplier Number</label>
        <Input
          {...register("supplier.supplier_number")}
          placeholder="Enter Supplier Number"
        />
        {errors.supplier?.supplier_number && <p>{errors.supplier.supplier_number.message}</p>}
      </div>

      {/* Total Quantity */}
      <div>
        <label>Total Quantity</label>
        <Input
          type="number"
          {...register("total_quantity", {setValueAs: (value) => (value === "" ? undefined : Number(value)),})}
          placeholder="Enter Total Quantity"
        />
        {errors.total_quantity && <p>{errors.total_quantity.message}</p>}
      </div>

      {/* Additional Info */}
      <div>
        <label>Purchase Type</label>
        <select {...register("additional_info.purchase_type")}>
          <option value="">Select Type</option>
          <option value="Buy">Buy</option>
          <option value="Sale">Sale</option>
        </select>
      </div>
      <div>
        <label>Description</label>
        <Textarea
          {...register("additional_info.description")}
          placeholder="Optional Description"
        />
      </div>

      <Button type="submit">
        {type === "create" ? "Create" : "Update"} Request
      </Button>
    </form>
  );
}
