"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  createProduct,
  updateProduct,
  getActiveProductCategories,
  getActiveBrands,
  getActiveItemVariants,
} from "@/actions/inventory/productActions";
import { useFormState } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";

const schema = z.object({
  product_name: z.string().nonempty("Product Name is required!"),
  product_qty: z
    .number()
    .positive("Product Qty must be a positive number!")
    .or(z.undefined().nullable()),
  image: z.any().optional(), // Comment out image schema validation,

  purchase_price: z.number().positive("require").or(z.undefined().nullable()),

  category: z.string().nonempty("Category is required!"),
  brand: z.string().nonempty("Brand is required!"),
  active_status: z.boolean().default(true),
  image: z.any().optional(), // Comment out image schema validation

  specifications: z
    .object({
      ram: z.object({ brand: z.string(), type: z.string() }).optional(),
      processor: z.object({ brand: z.string(), type: z.string() }).optional(),
      storage: z.object({ brand: z.string(), type: z.string() }).optional(),
      graphics: z.object({ brand: z.string(), type: z.string() }).optional(),
      os: z.object({ brand: z.string(), type: z.string() }).optional(),
    })
    .optional(),
});

const ProductForm = ({ type, data }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [imagePreview, setImagePreview] = useState(data?.image || null);
  const [img, setImg] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createProduct : updateProduct,
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
          category: data.category?._id.toString(),
          brand: data.brand?._id.toString(),
          specifications: data.specifications || {},
        });
      }
    }
    fetchOptions();
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log(img);
      // Send plain data to the server action
      const plainData = {
        ...formData,
        image: img?.secure_url || data?.image,
        id: data?._id,
      };

      await formAction(plainData);
    } catch (error) {
      console.error(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
    }
  });

  const handleImageUpload = (result) => {
    setImg(result.info); // Save the uploaded image info
    setImagePreview(result.info.secure_url); // Update the preview with the new image
  };

  const handleRemoveImage = () => {
    setImg(null);
    setImagePreview(data?.image || null);
  };

  const handleCancel = () => {
    setImg(null); // Reset temp image
    setImagePreview(data?.image || null); // Reset preview
    router.push("/inventory/products");
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(
        `Product Template ${
          type === "create" ? "created" : "updated"
        } successfully!`
      );
      router.push("/inventory/products");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-screen-2xl mx-auto p-8 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create  Products" : "Edit  Products"}
      </h1>
      <div className=" bg-gray-200 p-6 border rounded-1g shadow-1g mb-6 flex  gap-9">
        <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">
            Choose Product Category
          </h3>
          <div className="mb-4">
            <label className="text-sm font-medium">Product Category</label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              value={watch("category") || ""}
            >
              <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem
                      key={category._id}
                      value={category._id.toString()}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Product Image
            </label>
            <div className="flex items-center gap-4">
              {/* Image Preview Section */}
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                  <span className="text-xs text-gray-500">
                    {" "}
                    <Image
                      src="/upload.png"
                      alt="Upload Icon"
                      width={28}
                      height={28}
                    />
                  </span>
                </div>
              )}

              {/* Upload Button */}
              <CldUploadWidget
                uploadPreset="gurugoutam"
                onSuccess={handleImageUpload}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Upload Image
                  </button>
                )}
              </CldUploadWidget>
            </div>
            {/* Helper Text */}
            <p className="mt-2 text-xs text-gray-500">
              Supported formats: JPG, PNG (max size: 2MB)
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Product Name</label>
            <Input
              {...register("product_name")}
              placeholder="Enter Product Name"
              className="w-full max-w-xs border border-gray-300 rounded-md p-2"
            />
            {errors.product_name && (
              <p className="text-red-500 text-xs">
                {errors.product_name.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="product_qty" className="text-sm font-medium">
              Product Qty
            </label>
            <Input
              id="product_qty"
              type="number" // Ensures the input is numeric
              {...register("product_qty", { valueAsNumber: true })} // Converts the input to a number
              placeholder="Enter Product Qty"
              className="w-full max-w-xs border border-gray-300 rounded-md p-2"
            />
            {errors.product_qty && (
              <p className="text-red-500 text-xs">
                {errors.product_qty.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="purchase_price" className="text-sm font-medium">
              Product Price
            </label>
            <Input
              id="purchase_price"
              type="number"
              {...register("purchase_price", { valueAsNumber: true })}
              placeholder="Enter Product Qty"
              className="w-full max-w-xs border border-gray-300 rounded-md p-2"
            />
            {errors.purchase_price && (
              <p className="text-red-500 text-xs">
                {errors.purchase_price.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Brand</label>
            <Select
              onValueChange={(value) => setValue("brand", value)}
              value={watch("brand") || ""}
            >
              <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id.toString()}>
                      {brand.brand_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.brand && (
              <p className="text-red-500 text-xs">{errors.brand.message}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Specifications</h3>
          {["ram", "processor", "storage", "graphics", "os"].map((spec) => (
            <div key={spec} className="mb-4">
              <label className="text-sm font-medium capitalize">{spec}</label>
              <div className="flex space-x-4 mt-1">
                <Select
                  onValueChange={(value) =>
                    setValue(`specifications.${spec}.brand`, value)
                  }
                  value={watch(`specifications.${spec}.brand`) || ""}
                >
                  <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {brands.map((brand) => (
                        <SelectItem
                          key={brand._id}
                          value={brand._id.toString()}
                        >
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) =>
                    setValue(`specifications.${spec}.type`, value)
                  }
                  value={watch(`specifications.${spec}.type`) || ""}
                >
                  <SelectTrigger className="w-full max-w-xs border border-gray-300 rounded-md p-2">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {variants.map((variant) => (
                        <SelectItem
                          key={variant._id}
                          value={variant._id.toString()}
                        >
                          {variant.type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errors.specifications?.[spec] && (
                <p className="text-red-500 text-xs">
                  {errors.specifications[spec].message}
                </p>
              )}
            </div>
          ))}
          <div className="mt-4">
            <button type="button" className="text-blue-500 text-sm">
              Add Custom field
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80 h-28">
          <h3 className="text-lg font-semibold mb-4">Control</h3>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={watch("active_status")}
              onCheckedChange={(checked) => setValue("active_status", checked)}
            />
            <label className="text-sm font-medium">Active Status</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/inventory/products")}
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

export default ProductForm;


