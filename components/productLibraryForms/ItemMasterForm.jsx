// @/components/productLibraryForms/ItemMasterForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createItemMaster, updateItemMaster } from "@/actions/productLibrary/itemMasterActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const schema = z.object({
  item_name: z.string().min(1, { message: "Item Name is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

const ItemMasterForm = ({ type, data }) => {
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
    type === "create" ? createItemMaster : updateItemMaster,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Item ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/item-master");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add Item" : "Edit Item"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Item Name</label>
          <Input {...register("item_name")} placeholder="Enter Item Name" />
          {errors.item_name && <p className="text-red-500 text-xs">{errors.item_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Input {...register("description")} placeholder="Enter Description" />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
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
        <Button variant="outline" onClick={() => router.push("/product-library/item-master")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ItemMasterForm;
