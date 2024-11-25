"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { createInvoice, updateInvoice } from "@/actions/operation/invoiceAction";
// Zod Schema with Preprocessing for Invoice
const schema = z.object({
  invoice_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Invoice Number is required!" }),
  dc_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "DC Number is required!" }),
  order_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Order Number is required!" }),
  customer_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Customer Number is required!" }),
  invoice_date: z
    .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
    .refine((val) => !!val, { message: "Invoice Date is required!" }),
  customer_name: z
    .string()
    .min(1, { message: "Customer Name is required!" }),
  created_by: z
    .string()
    .min(1, { message: "Created By is required!" }),
  amount: z
    .preprocess((value) => (value ? parseFloat(value) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Amount is required!" }),
});

const InvoiceForm = ({ type, data }) => {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createInvoice : updateInvoice,
    { success: false, error: false, message: "" }
  );

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const plainData = {
        ...formData,
        id: data?._id,
      };

      await formAction(plainData);
    } catch (error) {
      console.error(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Invoice ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/operation/invoice");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create Invoice" : "Edit Invoice"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Invoice Number */}
            <div className="mb-4">
              <label htmlFor="invoice_number" className="text-sm font-medium">Invoice Number</label>
              <Input
                id="invoice_number"
                type="number"
                {...register("invoice_number")}
                placeholder="Enter Invoice Number"
              />
              {errors.invoice_number && <p className="text-red-500 text-xs">{errors.invoice_number.message}</p>}
            </div>

            {/* DC Number */}
            <div className="mb-4">
              <label htmlFor="dc_number" className="text-sm font-medium">DC Number</label>
              <Input
                id="dc_number"
                type="number"
                {...register("dc_number")}
                placeholder="Enter DC Number"
              />
              {errors.dc_number && <p className="text-red-500 text-xs">{errors.dc_number.message}</p>}
            </div>

            {/* Order Number */}
            <div className="mb-4">
              <label htmlFor="order_number" className="text-sm font-medium">Order Number</label>
              <Input
                id="order_number"
                type="number"
                {...register("order_number")}
                placeholder="Enter Order Number"
              />
              {errors.order_number && <p className="text-red-500 text-xs">{errors.order_number.message}</p>}
            </div>

            {/* Customer Number */}
            <div className="mb-4">
              <label htmlFor="customer_number" className="text-sm font-medium">Customer Number</label>
              <Input
                id="customer_number"
                type="number"
                {...register("customer_number")}
                placeholder="Enter Customer Number"
              />
              {errors.customer_number && <p className="text-red-500 text-xs">{errors.customer_number.message}</p>}
            </div>

            {/* Invoice Date */}
            <div className="mb-4">
              <label htmlFor="invoice_date" className="text-sm font-medium">Invoice Date</label>
              <Input
                id="invoice_date"
                type="date"
                {...register("invoice_date")}
              />
              {errors.invoice_date && <p className="text-red-500 text-xs">{errors.invoice_date.message}</p>}
            </div>

            {/* Customer Name */}
            <div className="mb-4">
              <label htmlFor="customer_name" className="text-sm font-medium">Customer Name</label>
              <Input
                id="customer_name"
                type="text"
                {...register("customer_name")}
                placeholder="Enter Customer Name"
              />
              {errors.customer_name && <p className="text-red-500 text-xs">{errors.customer_name.message}</p>}
            </div>

            {/* Created By */}
            <div className="mb-4">
              <label htmlFor="created_by" className="text-sm font-medium">Created By</label>
              <Input
                id="created_by"
                type="text"
                {...register("created_by")}
                placeholder="Enter Creator Name"
              />
              {errors.created_by && <p className="text-red-500 text-xs">{errors.created_by.message}</p>}
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label htmlFor="amount" className="text-sm font-medium">Amount</label>
              <Input
                id="amount"
                type="number"
                {...register("amount")}
                placeholder="Enter Amount"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Checkbox
              checked={watch("active_status")}
              onCheckedChange={(checked) => setValue("active_status", checked)}
            />
            <label className="text-sm font-medium">Active Status</label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/operation/invoice")}>Cancel</Button>
        <Button
          type="submit"
          className="bg-blue-500 text-white"
          disabled={state.loading} // Disable while loading
        >
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
