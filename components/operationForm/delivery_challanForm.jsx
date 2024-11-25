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
import { createDeliveryChallan, updateDeliveryChallan } from "@/actions/operation/delivery_challanAction";

// Zod Schema with Preprocessing for Delivery Challan
const schema = z.object({
  dc_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Delivery Challan ID is required!" }),
  order_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Order ID is required!" }),
  quotation_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Quotation ID is required!" }),
  dc_date: z
    .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
    .refine((val) => !!val, { message: "Delivery Challan Date is required!" }),
  company: z
    .string()
    .min(1, { message: "Company is required!" }),
  active_status: z.boolean().default(true),
});

const DeliveryChallanForm = ({ type, data }) => {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  // Using useFormState for create or update actions
  const [state, formAction] = useFormState(
    type === "create" ? createDeliveryChallan : updateDeliveryChallan,
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
      toast.success(`Delivery Challan ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/operation/delivery_challan");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create Delivery Challan" : "Edit Delivery Challan"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DC ID */}
            <div className="mb-4">
              <label htmlFor="dc_id" className="text-sm font-medium">Delivery Challan ID</label>
              <Input
                id="dc_id"
                type="number"
                {...register("dc_id")}
                placeholder="Enter Delivery Challan ID"
              />
              {errors.dc_id && <p className="text-red-500 text-xs">{errors.dc_id.message}</p>}
            </div>

            {/* Order ID */}
            <div className="mb-4">
              <label htmlFor="order_id" className="text-sm font-medium">Order ID</label>
              <Input
                id="order_id"
                type="number"
                {...register("order_id")}
                placeholder="Enter Order ID"
              />
              {errors.order_id && <p className="text-red-500 text-xs">{errors.order_id.message}</p>}
            </div>

            {/* Quotation ID */}
            <div className="mb-4">
              <label htmlFor="quotation_id" className="text-sm font-medium">Quotation ID</label>
              <Input
                id="quotation_id"
                type="number"
                {...register("quotation_id")}
                placeholder="Enter Quotation ID"
              />
              {errors.quotation_id && <p className="text-red-500 text-xs">{errors.quotation_id.message}</p>}
            </div>

            {/* DC Date */}
            <div className="mb-4">
              <label htmlFor="dc_date" className="text-sm font-medium">Delivery Challan Date</label>
              <Input
                id="dc_date"
                type="date"
                {...register("dc_date")}
              />
              {errors.dc_date && <p className="text-red-500 text-xs">{errors.dc_date.message}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input {...register("company")} placeholder="Enter Company Name" />
              {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
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
        <Button variant="outline" onClick={() => router.push("/operation/delivery_challan")}>Cancel</Button>
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

export default DeliveryChallanForm;
