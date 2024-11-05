// @/components/productLibraryForms/StockLocationForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createStockLocation, updateStockLocation } from "@/actions/productLibrary/stockLocationActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Define schema for form validation
const schema = z.object({
  stock_location_id: z.string().min(1, { message: "Stock Location ID is required!" }),
  stock_name: z.string().optional(),
  mail_id: z.string().email("Invalid email").optional(),
  phone_number: z.string().optional(),
  address: z.object({
    pincode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    landmark: z.string().optional(),
    street: z.string().optional(),
  }).optional(),
  active_status: z.boolean().default(true),
});

const StockLocationForm = ({ type, data }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });
  
  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createStockLocation : updateStockLocation,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    console.log("Submitted Form Data:", formData); // Log data for debugging
    try {
      formAction({...formData, id: data?._id});
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
      
  });

  // Success/Error handling
  useEffect(() => {
    if (state?.success) {
      toast.success(`Stock Location ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/stock-location");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Stock Location" : "Edit Stock Location"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Stock Location ID</label>
          <Input {...register("stock_location_id")} placeholder="Enter Stock Location ID" />
          {errors.stock_location_id && <p className="text-red-500 text-xs">{errors.stock_location_id.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Stock Name</label>
          <Input {...register("stock_name")} placeholder="Enter Stock Name" />
          {errors.stock_name && <p className="text-red-500 text-xs">{errors.stock_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Mail ID</label>
          <Input {...register("mail_id")} placeholder="Enter Mail ID" />
          {errors.mail_id && <p className="text-red-500 text-xs">{errors.mail_id.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <Input {...register("phone_number")} placeholder="Enter Phone Number" />
          {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Pincode</label>
          <Input {...register("address.pincode")} placeholder="Enter Pincode" />
        </div>

        <div>
          <label className="text-sm font-medium">Country</label>
          <Input {...register("address.country")} placeholder="Enter Country" />
        </div>

        <div>
          <label className="text-sm font-medium">State</label>
          <Input {...register("address.state")} placeholder="Enter State" />
        </div>

        <div>
          <label className="text-sm font-medium">City</label>
          <Input {...register("address.city")} placeholder="Enter City" />
        </div>

        <div>
          <label className="text-sm font-medium">Landmark</label>
          <Input {...register("address.landmark")} placeholder="Enter Landmark" />
        </div>

        <div>
          <label className="text-sm font-medium">Street</label>
          <Input {...register("address.street")} placeholder="Enter Street" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          checked={watch("active_status")}
          onCheckedChange={(checked) => setValue("active_status", checked)}
        />
        <label className="text-sm font-medium">Active Status</label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/product-library/stock-location")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default StockLocationForm;
