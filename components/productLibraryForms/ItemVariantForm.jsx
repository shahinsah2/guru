// @/components/productLibraryForms/ItemVariantForm.jsx

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
  createItemVariant,
  updateItemVariant,
  getActiveItemMasters,
} from "@/actions/productLibrary/itemVariantActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Define schema for form validation
const schema = z.object({
  item_name: z.string().nonempty("Item Name is required!"),
  type: z.string().nonempty("Type is required!"),
  active_status: z.boolean().default(true),
});

const ItemVariantForm = ({ type, data }) => {
  const router = useRouter();
  const [itemMasters, setItemMasters] = useState([]);
  
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
    type === "create" ? createItemVariant : updateItemVariant,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    async function fetchItemMasters() {
      const items = await getActiveItemMasters();
      setItemMasters(items);
    }
    fetchItemMasters();
    reset(data || {}); // Reset form with initial data if available
  }, [data, reset]);

  useEffect(() => {
    if (data?.item_name) {
      setValue("item_name", data.item_name); // Set initial value for item_name if editing
    }
  }, [data, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      console.error(err.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Item Type ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/item-variant");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
    <div className="bg-gray-50 p-8 px-6 border rounded-lg shadow-lg mb-6">  
        <h1 className="text-xl font-semibold">
      {type === "create" ? "Add  item varient" : "Edit Product Category"}
    </h1>

      {/* Category Information and Active Status Side by Side */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Category Information Fields */}
        <div className="bg-gray-50 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      
        <div>
          <label className="text-sm font-medium">Item/Specification Name</label>
          <Select onValueChange={(value) => setValue("item_name", value)} defaultValue={data?.item_name || ""}>
            <SelectTrigger  className="w-full max-w-xs border border-gray-300 rounded-md p-2">
              <SelectValue placeholder="Select Item Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {itemMasters.map((item) => (
                  <SelectItem key={item._id} value={item._id.toString()}>
                    {item.item_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.item_name && (
            <p className="text-red-500 text-xs">{errors.item_name.message}</p>
          )}
      
          <label className="text-sm font-medium">Type</label>
          <Input {...register("type")} placeholder="Enter Item Type"  className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
          {errors.type && (
            <p className="text-red-500 text-xs">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Active Status Section */}
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
      <h3 className="text-lg font-semibold mb-4">Control</h3>
      <div className="flex items-center gap-2">
        <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
        <label className="text-sm font-medium">Active Status</label>
      </div>
    </div>
    </div>
    </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/product-library/item-variant")}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ItemVariantForm;