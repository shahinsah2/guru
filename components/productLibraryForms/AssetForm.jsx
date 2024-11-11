// @/components/productLibraryForms/AssetForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  createAsset,
  updateAsset,
  getActiveItemMasters,
  getActiveItemVariants,
  getActiveBrands,
} from "@/actions/productLibrary/assetActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Define schema for form validation
const schema = z.object({
  item_name: z.string().nonempty("Item Name is required!"),
  item_type: z.string().nonempty("Item Type is required!"),
  brand: z.string().nonempty("Brand is required!"),
  price: z.number().min(1, "Price must be greater than zero"),
  date: z.string().nonempty("Date is required!"),
  warranty: z.string().optional(),
  warranty_time: z.number().optional(),
  active_status: z.boolean().default(true),
  remarks: z.string().optional(),
});

const AssetForm = ({ type, data }) => {
  const router = useRouter();
  const [itemMasters, setItemMasters] = useState([]);
  const [itemVariants, setItemVariants] = useState([]);
  const [brands, setBrands] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAsset : updateAsset,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  // Fetch options for dropdowns on load
  useEffect(() => {
    async function fetchData() {
      const [items, variants, brandsList] = await Promise.all([
        getActiveItemMasters(),
        getActiveItemVariants(),
        getActiveBrands(),
      ]);
      setItemMasters(items);
      setItemVariants(variants);
      setBrands(brandsList);

      // Reset form with initial data after fetching dropdown options
      if (data) {
        reset({
          ...data,
          item_name: data.item_name?._id,  // Set initial item_name ID
          item_type: data.item_type?._id,  // Set initial item_type ID
          brand: data.brand?._id,          // Set initial brand ID
        });
      }
    }
    fetchData();
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      console.error(err.message || "An unexpected error occurred.");
    }
  });

  // Success/Error toast notifications
  useEffect(() => {
    if (state?.success) {
      toast.success(`Asset ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/assets");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-screen-2xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
    <div className="bg-gray-200 flex justify-between gap-8 p-5">
  
      {/* Asset Information Section */}
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
        <h3 className="text-lg font-semibold mb-4">Asset Information</h3>
        <div className="mb-4">
          <label className="text-sm font-medium">Item Name</label>
          <Select onValueChange={(value) => setValue("item_name", value)} value={watch("item_name") || ""}>
            <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2"><SelectValue placeholder="Select Item Name"  /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {itemMasters.map((item) => (
                  <SelectItem key={item._id} value={item._id.toString()}>{item.item_name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.item_name && <p className="text-red-500 text-xs">{errors.item_name.message}</p>}
        </div>
  
        <div className="mb-4">
          <label className="text-sm font-medium">Item Type</label>
          <Select onValueChange={(value) => setValue("item_type", value)} value={watch("item_type") || ""}>
            <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2"><SelectValue placeholder="Select Item Type" /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {itemVariants.map((variant) => (
                  <SelectItem key={variant._id} value={variant._id.toString()}>{variant.type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.item_type && <p className="text-red-500 text-xs">{errors.item_type.message}</p>}
        </div>
  
        <div className="mb-4">
          <label className="text-sm font-medium">Brand</label>
          <Select onValueChange={(value) => setValue("brand", value)} value={watch("brand") || ""}>
            <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2"><SelectValue placeholder="Select Brand" /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id.toString()}>{brand.brand_name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.brand && <p className="text-red-500 text-xs">{errors.brand.message}</p>}
        </div>
      </div>
  
      {/* Additional Details Section */}
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
        <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
        <div className="mb-4">
          <label className="text-sm font-medium">Price</label>
          <Input {...register("price", { valueAsNumber: true })} placeholder="Enter Price" 
          className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" {...register("date")} placeholder="Select Date" className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
          {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium">Warranty</label>
          <Input {...register("warranty")} placeholder="Enter Warranty Period"  className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium">Warranty Time</label>
          <Input {...register("warranty_time", { valueAsNumber: true })} placeholder="Enter Warranty Time" className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium">Remarks</label>
          <Input {...register("remarks")} placeholder="Enter Remarks" className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
        </div>
      </div>
  
      {/* Status Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mt-5 mr-5 border border-gray-200 w-72 h-28">
      <h3 className="text-lg font-semibold mb-4">Control</h3>
        <div className="flex items-center gap-2">
          <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
          <label className="text-sm font-medium">Active Status</label>
        </div>
      </div>
    </div>
  
    {/* Actions */}
    <div className="flex justify-end gap-4 mt-6">
      <Button variant="outline" onClick={() => router.push("/product-library/assets")}>
        Cancel
      </Button>
      <Button type="submit" className="bg-blue-500 text-white">
        {type === "create" ? "Create" : "Update"}
      </Button>
    </div>
  </form>
  
  );
};

export default AssetForm;