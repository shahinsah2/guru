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
import { createGrn, updateGrn } from "@/actions/operation/grnAction";

// Zod Schema with Preprocessing for GRN
const schema = z.object({
  grn_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "GRN Number is required!" }),
  dc_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "DC Number is required!" }),
  owner_number: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined()))
    .refine((val) => !!val, { message: "Owner Number is required!" }),
  date: z
    .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
    .refine((val) => !!val, { message: "Date is required!" }),
  company: z.string().min(1, { message: "Company is required!" }),
});

const GrnForm = ({ type, data }) => {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createGrn : updateGrn,
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
      toast.success(`GRN ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/operation/grn");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create GRN" : "Edit GRN"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GRN Number */}
            <div className="mb-4">
              <label htmlFor="grn_number" className="text-sm font-medium">GRN Number</label>
              <Input
                id="grn_number"
                type="number"
                {...register("grn_number")}
                placeholder="Enter GRN Number"
              />
              {errors.grn_number && <p className="text-red-500 text-xs">{errors.grn_number.message}</p>}
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

            {/* Owner Number */}
            <div className="mb-4">
              <label htmlFor="owner_number" className="text-sm font-medium">Owner Number</label>
              <Input
                id="owner_number"
                type="number"
                {...register("owner_number")}
                placeholder="Enter Owner Number"
              />
              {errors.owner_number && <p className="text-red-500 text-xs">{errors.owner_number.message}</p>}
            </div>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <Input
                id="date"
                type="date"
                {...register("date")}
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>

            {/* Company */}
            <div className="mb-4">
              <label htmlFor="company" className="text-sm font-medium">Company</label>
              <Input
                id="company"
                type="text"
                {...register("company")}
                placeholder="Enter Company"
              />
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
        <Button variant="outline" onClick={() => router.push("/operation/grn")}>Cancel</Button>
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

export default GrnForm;
