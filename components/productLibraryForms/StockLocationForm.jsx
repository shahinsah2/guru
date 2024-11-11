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
      await formAction({ ...formData, id: data?._id });
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
    <form className="w-full max-w-screen-2xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="flex justify-between gap-8">
        
        {/* Stock Location Information Section */}
        <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Stock Location Information</h3>
          <div className="mb-4">
            <label className="text-sm font-medium">Stock Location ID</label>
            <Input {...register("stock_location_id")} placeholder="Enter Stock Location ID"  className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
            {errors.stock_location_id && <p className="text-red-500 text-xs">{errors.stock_location_id.message}</p>}
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium">Stock Name</label>
            <Input {...register("stock_name")} placeholder="Enter Stock Name"  className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
            {errors.stock_name && <p className="text-red-500 text-xs">{errors.stock_name.message}</p>}
          </div>
        </div>

        {/* Address Details Section */}
        <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Pincode</label>
              <Input {...register("address.pincode")} placeholder="Enter Pincode"   className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input {...register("address.country")} placeholder="Enter Country"   className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input {...register("address.state")} placeholder="Enter State"   className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input {...register("address.city")} placeholder="Enter City"   className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label className="text-sm font-medium">Landmark</label>
              <Input {...register("address.landmark")} placeholder="Enter Landmark"  className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Street</label>
              <Input {...register("address.street")} placeholder="Enter Street"  className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
            </div>
          </div>
        </div>

        {/* Active Status Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80 h-28">
          <h3 className="text-lg font-semibold mb-4">Control</h3>
          <div className="flex items-center gap-2">
            <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
            <label className="text-sm font-medium">Active Status</label>
          </div>
        </div>
      </div>

      {/* Actions */}
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