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

import { createSupplier, updateSupplier } from "@/actions/procurement/supplierAction";

// Zod Schema with Preprocessing
const schema = z.object({

  supplier: z.string().min(1, { message: "Supplier is required!" }),

  website: z.string().url({ message: "Enter a valid URL!" }).optional(),

  emp_name: z.string().min(1, { message: "Employee Name is required!" }),

  e_mail: z.string().email({ message: "Enter a valid email!" }),

  emp_mobile: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

  emp_office_num: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),

  executive: z.string().min(1, { message: "Executive is required!" }),
  active_status: z.boolean().default(true),
});

const SupplierForm = ({ type, data }) => {
  
    const router = useRouter();


    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
      resolver: zodResolver(schema),
      defaultValues: data || {},
    });
  
    const [state, formAction] = useFormState(
      type === "create" ? createSupplier : updateSupplier,
      { success: false, error: false, message: "" }
    );
  
    const onSubmit = handleSubmit(async (formData) => {
      console.log(onSubmit,"subbbbbbbbbbbbbbbbbbbb")
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
        router.push("/procurement/supplier");
        router.refresh();
      } else if (state?.error) {
        toast.error(state.message);
      }
    }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create Supplier" : "Edit Supplier"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
    
          

          {/* supplier */}
          <div>
            <label className="text-sm font-medium">Supplier</label>
            <Input {...register("supplier")} placeholder="Enter Owner" />
            {errors.supplier && <p className="text-red-500 text-xs">{errors.supplier.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Website</label>
            <Input {...register("website")} placeholder="Enter Owner" />
            {errors.website && <p className="text-red-500 text-xs">{errors.website.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">EMP Name</label>
            <Input {...register("emp_name")} placeholder="Enter Owner" />
            {errors.emp_name && <p className="text-red-500 text-xs">{errors.emp_name.message}</p>}
          </div>


              {/* Email */}
              <div>
              <label className="text-sm font-medium">EMP Email</label>
              <Input {...register("e_mail")} placeholder="Enter Email" />
              {errors.e_mail && <p className="text-red-500 text-xs">{errors.e_mail.message}</p>}
            </div>

          
          <div>
            <label className="text-sm font-medium"> EMP Mobile Number</label>
            <Input
              type="number"
              {...register("emp_mobile")}
              placeholder="Enter emp_mobile"
            />
            {errors.emp_mobile && <p className="text-red-500 text-xs">{errors.emp_mobile.message}</p>}
          </div>

          {/* emp_office_num  */}
          <div>
            <label className="text-sm font-medium"> EMP Office Number</label>
            <Input
              type="number"
              {...register("emp_office_num")}
              placeholder="Enter emp_office_num"
            />
            {errors.emp_office_num && <p className="text-red-500 text-xs">{errors.emp_office_num.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Executive</label>
            <Input {...register("executive")} placeholder="Enter executive" />
            {errors.executive && <p className="text-red-500 text-xs">{errors.executive.message}</p>}
          </div>
  
          </div>

        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/procurement/supplier")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;