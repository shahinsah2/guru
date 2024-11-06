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
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add Item Type" : "Edit Item Type"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Item/Specification Name</label>
          <Select onValueChange={(value) => setValue("item_name", value)} defaultValue={data?.item_name || ""}>
            <SelectTrigger>
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
        </div>

        <div>
          <label className="text-sm font-medium">Type</label>
          <Input {...register("type")} placeholder="Enter Item Type" />
          {errors.type && (
            <p className="text-red-500 text-xs">{errors.type.message}</p>
          )}
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
