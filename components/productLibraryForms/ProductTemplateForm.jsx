// @/components/productLibraryForms/ProductTemplateForm.jsx

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
import { createProductTemplate, updateProductTemplate, getActiveProductCategories, getActiveBrands, getActiveItemVariants } from "@/actions/productLibrary/productTemplateActions";
import { useFormState } from "react-dom";

const schema = z.object({
  product_name: z.string().nonempty("Product Name is required!"),
  category: z.string().nonempty("Category is required!"),
  brand: z.string().nonempty("Brand is required!"),
  model: z.string().nonempty("Model is required!"),
  active_status: z.boolean().default(true),
  description: z.string().optional(),
  // image: z.any().optional(), // Comment out image schema validation
  specifications: z.object({
    ram: z.object({ brand: z.string(), type: z.string() }).optional(),
    processor: z.object({ brand: z.string(), type: z.string() }).optional(),
    storage: z.object({ brand: z.string(), type: z.string() }).optional(),
    graphics: z.object({ brand: z.string(), type: z.string() }).optional(),
    os: z.object({ brand: z.string(), type: z.string() }).optional()
  }).optional()
});

const ProductTemplateForm = ({ type, data }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createProductTemplate : updateProductTemplate,
    { success: false, error: false, message: "" }
  );

  useEffect(() => {
    async function fetchOptions() {
      const [categoriesData, brandsData, variantsData] = await Promise.all([
        getActiveProductCategories(),
        getActiveBrands(),
        getActiveItemVariants(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
      setVariants(variantsData);

      if (data) {
        reset({
          ...data,
          category: data.category?._id,
          brand: data.brand?._id,
          specifications: data.specifications || {}
        });
      }
    }
    fetchOptions();
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // let imagePath = data?.image || ""; // Comment out image path variable

      // if (formData.image && formData.image[0]) {
      //   const file = formData.image[0];
      //   const uploadResponse = await fetch('/api/upload-image', {
      //     method: 'POST',
      //     body: new FormData().append("image", file),
      //   });

      //   if (!uploadResponse.ok) throw new Error("Image upload failed");

      //   const { filePath } = await uploadResponse.json();
      //   imagePath = filePath;
      // }

      await formAction({ ...formData, /* image: imagePath, */ id: data?._id });
    } catch (error) {
      console.error(error.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Product Template ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/product-template");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h1 className="text-xl font-semibold col-span-2">{type === "create" ? "Add Product Template" : "Edit Product Template"}</h1>

      <div>
        <label className="text-sm font-medium">Product Category</label>
        <Select onValueChange={(value) => setValue("category", value)} value={watch("category") || ""}>
          <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id.toString()}>{category.category_name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
      </div>

      {/* <div>
        <label className="text-sm font-medium">Add Images</label>
        <Input type="file" {...register("image")} accept="image/*" />
        {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}
      </div> */}

      <div>
        <label className="text-sm font-medium">Product Name</label>
        <Input {...register("product_name")} placeholder="Enter Product Name" />
        {errors.product_name && <p className="text-red-500 text-xs">{errors.product_name.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Brand</label>
        <Select onValueChange={(value) => setValue("brand", value)} value={watch("brand") || ""}>
          <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
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

      <div>
        <label className="text-sm font-medium">Model</label>
        <Input {...register("model")} placeholder="Enter Model" />
        {errors.model && <p className="text-red-500 text-xs">{errors.model.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="text-sm font-medium">Description</label>
        <Input {...register("description")} placeholder="Enter Description" />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {["ram", "processor", "storage", "graphics", "os"].map((spec) => (
          <div key={spec}>
            <label className="text-sm font-medium capitalize">{spec}</label>
            <div className="flex space-x-2">
              <Select onValueChange={(value) => setValue(`specifications.${spec}.brand`, value)} value={watch(`specifications.${spec}.brand`) || ""}>
                <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
                <SelectContent><SelectGroup>{brands.map(brand => <SelectItem key={brand._id} value={brand._id.toString()}>{brand.brand_name}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
              <Select onValueChange={(value) => setValue(`specifications.${spec}.type`, value)} value={watch(`specifications.${spec}.type`) || ""}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent><SelectGroup>{variants.map(variant => <SelectItem key={variant._id} value={variant._id.toString()}>{variant.type}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
            </div>
            {errors.specifications?.[spec] && <p className="text-red-500 text-xs">{errors.specifications[spec].message}</p>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 col-span-2">
        <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
        <label className="text-sm font-medium">Active Status</label>
      </div>

      <div className="col-span-2 flex justify-end">
      <Button
          variant="outline"
          onClick={() => router.push("/product-library/product-template")}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white mx-2">{type === "create" ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};

export default ProductTemplateForm;
