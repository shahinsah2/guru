"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { createPo, updatePo } from "@/actions/procurement/purchase_orderAction";

// Zod Schema with Preprocessing
const schema = z.object({
  po_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),
    


  po_quotation_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

  po_date: z
    .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined())),

  po_owner: z.string().min(1, { message: "Owner is required!" }),

  supplier: z.string().min(1, { message: "Supplier is required!" }),

  supplier_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

  total_cost: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

  product_qty: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),
});

const PoForm = ({ type, data }) => {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createPo : updatePo,
    { success: false, error: false, message: "" }
  );

  const onSubmit = handleSubmit(async (formData) => {
    console.log("Submitting Data:", formData); // Log the form data to ensure it's being passed correctly

    try {
      const plainData = {
        ...formData,
        id: data?._id, // Pass the existing data if available
      };

      await formAction(plainData);
    } catch (error) {
      console.error(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Purchase Order ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/procurement/purchase_order");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  useEffect(() => {
    // If data is provided for editing, populate the form with it
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
    <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create  Purchase orders" : "Edit Purchase orders  "}
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PR ID */}
          <div className="mb-4">
            <label htmlFor="po_id" className="text-sm font-medium">PO ID</label>
            <Input
              id="po_id"
              type="number"
              {...register("po_id")}
              placeholder="Enter quotation id"
            />
            {errors.po_id && <p className="text-red-500 text-xs">{errors.po_id.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="po_quotation_id" className="text-sm font-medium">PO Quottation ID</label>
            <Input
              id="po_quotation_id"
              type="number"
              {...register("po_quotation_id")}
              placeholder="Enter quotation id"
            />
            {errors.po_quotation_id && <p className="text-red-500 text-xs">{errors.po_quotation_id.message}</p>}
          </div>

          {/* PR Date */}
          <div className="mb-4">
            <label htmlFor="po_date" className="text-sm font-medium">PO Date</label>
            <Input
              id="po_date"
              type="date"
              {...register("po_date")}
            />
            {errors.po_date && <p className="text-red-500 text-xs">{errors.po_date.message}</p>}
          </div>

          {/* Other Fields */}
          {/* po_owner */}
          <div>
            <label className="text-sm font-medium">PO Owner</label>
            <Input {...register("po_owner")} placeholder="Enter Owner" />
            {errors.po_owner && <p className="text-red-500 text-xs">{errors.po_owner.message}</p>}
          </div>

          {/* Supplier */}
          <div>
            <label className="text-sm font-medium">Supplier</label>
            <Input {...register("supplier")} placeholder="Enter Supplier" />
            {errors.supplier && <p className="text-red-500 text-xs">{errors.supplier.message}</p>}
          </div>

          {/* Total Product Qty */}
          <div>
            <label className="text-sm font-medium"> Supplier Number</label>
            <Input
              type="number"
              {...register("supplier_number")}
              placeholder="Enter supplier_number"
            />
            {errors.supplier_number && <p className="text-red-500 text-xs">{errors.supplier_number.message}</p>}
          </div>

          {/* Approve Status */}
          <div>
            <label className="text-sm font-medium"> Total Cost</label>
            <Input
              type="number"
              {...register("total_cost")}
              placeholder="Enter total_cost"
            />
            {errors.total_cost && <p className="text-red-500 text-xs">{errors.total_cost.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium"> Product QTY</label>
            <Input
              type="number"
              {...register("product_qty")}
              placeholder="Enter product_qty"
            />
            {errors.product_qty && <p className="text-red-500 text-xs">{errors.product_qty.message}</p>}
          </div>

       
        </div>
   
      </div>
    </div>
    <div className="flex justify-end gap-4 mt-6">
      <Button variant="outline" onClick={() => router.push("/procurement/po_quotation")}>Cancel</Button>
      <Button type="submit" className="bg-blue-500 text-white">{type === "create" ? "Create" : "Update"}</Button>
    </div>
  </form>
);
};

export default PoForm;