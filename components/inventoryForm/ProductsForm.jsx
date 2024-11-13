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
import { createProduct, updateProduct, getActiveProductCategories, getActiveBrands, getActiveItemVariants } from "@/actions/inventory/productsActions";

const schema = z.object({
  product_name: z.string().nonempty("Product Name is required!"),
  category: z.string().nonempty("Category is required!"),
  brand: z.string().nonempty("Brand is required!"),
  model: z.string().nonempty("Model is required!"),
  active_status: z.boolean().default(true),
  description: z.string().optional(),
  specifications: z.object({
    ram: z.object({ brand: z.string(), type: z.string() }).optional(),
    processor: z.object({ brand: z.string(), type: z.string() }).optional(),
    storage: z.object({ brand: z.string(), type: z.string() }).optional(),
    graphics: z.object({ brand: z.string(), type: z.string() }).optional(),
    os: z.object({ brand: z.string(), type: z.string() }).optional()
  }).optional()
});

const ProductsForm = ({ type, data }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [submissionState, setSubmissionState] = useState({ success: null, error: null });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

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
      await (type === "create" ? createProduct : updateProduct)({ ...formData, id: data?._id });
      setSubmissionState({ success: true, error: null });
    } catch (error) {
      setSubmissionState({ success: false, error: error.message || "An unexpected error occurred." });
    }
  });

  useEffect(() => {
    if (submissionState.success) {
      toast.success(`Product ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/products");
      router.refresh();
    } else if (submissionState.error) {
      toast.error(submissionState.error);
    }
  }, [submissionState, router, type]);

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h1 className="text-xl font-semibold col-span-2">{type === "create" ? "Add Product" : "Edit Product"}</h1>

      <div>
        <label className="text-sm font-medium">Product Name</label>
        <Input {...register("product_name")} placeholder="Enter product name" />
        {errors.product_name && <p className="text-red-500 text-xs">{errors.product_name.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
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
        <Input {...register("model")} placeholder="Enter model" />
        {errors.model && <p className="text-red-500 text-xs">{errors.model.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Input {...register("description")} placeholder="Enter description" />
      </div>

      <div>
        <label className="text-sm font-medium">RAM</label>
        <Input {...register("specifications.ram.brand")} placeholder="Enter RAM brand" />
        <Input {...register("specifications.ram.type")} placeholder="Enter RAM type" />
      </div>

      <div>
        <label className="text-sm font-medium">Processor</label>
        <Input {...register("specifications.processor.brand")} placeholder="Enter processor brand" />
        <Input {...register("specifications.processor.type")} placeholder="Enter processor type" />
      </div>

      <div>
        <label className="text-sm font-medium">Storage</label>
        <Input {...register("specifications.storage.brand")} placeholder="Enter storage brand" />
        <Input {...register("specifications.storage.type")} placeholder="Enter storage type" />
      </div>

      <div>
        <label className="text-sm font-medium">Graphics</label>
        <Input {...register("specifications.graphics.brand")} placeholder="Enter graphics brand" />
        <Input {...register("specifications.graphics.type")} placeholder="Enter graphics type" />
      </div>

      <div>
        <label className="text-sm font-medium">Operating System</label>
        <Input {...register("specifications.os.brand")} placeholder="Enter OS brand" />
        <Input {...register("specifications.os.type")} placeholder="Enter OS type" />
      </div>

      <div className="flex items-center">
        <Checkbox {...register("active_status")} />
        <label className="ml-2 text-sm font-medium">Active Status</label>
      </div>

      <div className="col-span-2 flex justify-end">
        <Button variant="outline" onClick={() => router.push("/product-library/products")}>Cancel</Button>
        <Button type="submit" className="bg-blue-500 text-white mx-2">{type === "create" ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};

export default ProductsForm;
