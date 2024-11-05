// @/components/productLibraryForms/ProductCategoryForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createProductCategory, updateProductCategory } from "@/actions/productLibrary/productCategoryActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useFormState } from "react-dom";

const schema = z.object({
  category_code: z.string().min(1, { message: "Category Code is required!" }),
  category_name: z.string().min(1, { message: "Category Name is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

const ProductCategoryForm = ({ type, data }) => {
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
    type === "create" ? createProductCategory : updateProductCategory,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    formAction({ ...formData, id: data?._id });
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Product Category ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/product-categories");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add Product Category" : "Edit Product Category"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category Code</label>
          <Input {...register("category_code")} placeholder="Enter Category Code" />
          {errors.category_code && <p className="text-red-500 text-xs">{errors.category_code.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Category Name</label>
          <Input {...register("category_name")} placeholder="Enter Category Name" />
          {errors.category_name && <p className="text-red-500 text-xs">{errors.category_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Input {...register("description")} placeholder="Enter Description" />
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
        <Button variant="outline" onClick={() => router.push("/product-library/product-categories")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ProductCategoryForm;
