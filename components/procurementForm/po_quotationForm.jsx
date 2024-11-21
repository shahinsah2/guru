

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

import { createPoQuotation, updatePoQuotation } from "@/actions/procurement/po_quotationAction";



// Zod Schema with Preprocessing
const schema = z.object({
    quotation_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

    phone_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),


    quotation_date: z
    .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined())),

  quote_owner: z.string().min(1, { message: "Owner is required!" }),

  supplier: z.string().min(1, { message: "Supplier is required!" }),

  purchase_price: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

  active_status: z.boolean().default(true),
});

const PoQuotationForm = ({ type, data }) => {
 
  const router = useRouter();


  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createPoQuotation : updatePoQuotation,
    { success: false, error: false, message: "" }
  );

  const onSubmit = handleSubmit(async (formData) => {
    console.log(onSubmit)
    try {
      // Send plain data to the server action
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
    if (state?.success) {
      toast.success(`Product Template ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/procurement/po_quotation");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create  Po Quotation" : "Edit Po  Quotation"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PR ID */}
            <div className="mb-4">
              <label htmlFor="quotation_id" className="text-sm font-medium">quottation ID</label>
              <Input
                id="quotation_id"
                type="number"
                {...register("quotation_id")}
                placeholder="Enter quotation id"
              />
              {errors.quotation_id && <p className="text-red-500 text-xs">{errors.quotation_id.message}</p>}
            </div>

            {/* PR Date */}
            <div className="mb-4">
              <label htmlFor="quotation_date" className="text-sm font-medium">quotation Date</label>
              <Input
                id="quotation_date"
                type="date"
                {...register("quotation_date")}
              />
              {errors.quotation_date && <p className="text-red-500 text-xs">{errors.quotation_date.message}</p>}
            </div>

            {/* Other Fields */}
            {/* quote_owner */}
            <div>
              <label className="text-sm font-medium">quote_owner</label>
              <Input {...register("quote_owner")} placeholder="Enter Owner" />
              {errors.quote_owner && <p className="text-red-500 text-xs">{errors.quote_owner.message}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label className="text-sm font-medium">Supplier</label>
              <Input {...register("supplier")} placeholder="Enter Supplier" />
              {errors.supplier && <p className="text-red-500 text-xs">{errors.supplier.message}</p>}
            </div>

            {/* Total Product Qty */}
            <div>
              <label className="text-sm font-medium"> phone Number</label>
              <Input
                type="number"
                {...register("phone_number")}
                placeholder="Enter phone_number"
              />
              {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
            </div>

            {/* Approve Status */}
            <div>
              <label className="text-sm font-medium"> Purchase Price</label>
              <Input
                type="number"
                {...register("purchase_price")}
                placeholder="Enter purchase_price"
              />
              {errors.purchase_price && <p className="text-red-500 text-xs">{errors.purchase_price.message}</p>}
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
        <Button variant="outline" onClick={() => router.push("/procurement/po_quotation")}>Cancel</Button>
        <Button type="submit" className="bg-blue-500 text-white">{type === "create" ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};

export default PoQuotationForm;

