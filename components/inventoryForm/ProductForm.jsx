"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct } from "@/actions/inventory/productActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Schema for validation
const schema = z.object({
  owner: z.string().min(1, { message: "Owner is required!" }),
  select_supplier: z.string().min(1, { message: "Supplier is required!" }),
  supplier_name: z.string().min(1, { message: "Supplier Name is required!" }),
  supplier_mail: z.string().email({ message: "Invalid email format" }).min(1, { message: "Supplier Email is required!" }),
  total_price: z.boolean(), // Change this to boolean since we're using a checkbox
  active_status: z.boolean().default(true),
});

export default function ProductForm({ type, data }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {
      owner: "",
      select_supplier: "",
      supplier_name: "",
      supplier_mail: "",
      total_price: false, // Default value for checkbox
      active_status: true,
    },
  });

  // Form state management
  const [state, setState] = useState({
    success: false,
    error: false,
    loading: false,
    message: "",
  });

  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    setState((prevState) => ({ ...prevState, loading: true })); // Set loading to true on submit

    // Ensure total_price is treated as a number before submission
    const parsedFormData = {
      ...formData,
      total_price: formData.total_price ? 1 : 0, // Convert boolean to 1 or 0
    };

    const response = await (type === "create" ? createProduct : updateProduct)({ ...parsedFormData, id: data?._id });

    if (response && !response.success) {
      setState({
        success: false,
        error: true,
        loading: false,
        message: response.message,
      });
    } else {
      setState({
        success: true,
        error: false,
        loading: false,
        message: `${type === "create" ? "Created" : "Updated"} product successfully!`,
      });
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/inventory/products");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">{type === "create" ? "Create Product" : "Edit Product"}</h1>

        <div className="bg-gray-200 p-6 border rounded-lg shadow-lg mb-6 flex gap-40">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-md flex-1">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Owner</label>
                <Input {...register("owner")} placeholder="Enter Owner Name" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
                {errors.owner && <p className="text-red-500 text-xs">{errors.owner.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Supplier</label>
                <Input {...register("select_supplier")} placeholder="Enter Supplier Name" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
                {errors.select_supplier && <p className="text-red-500 text-xs">{errors.select_supplier.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Supplier Name</label>
                <Input {...register("supplier_name")} placeholder="Enter Supplier Name" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
                {errors.supplier_name && <p className="text-red-500 text-xs">{errors.supplier_name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Supplier Email</label>
                <Input {...register("supplier_mail")} type="email" placeholder="Enter Supplier Email" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
                {errors.supplier_mail && <p className="text-red-500 text-xs">{errors.supplier_mail.message}</p>}
              </div>

              <div>
                 <label className="text-sm font-medium">Are you sure?</label> {/* Total Price  */}
                <Checkbox
                  {...register("total_price")}
                  checked={watch("total_price")}
                  onCheckedChange={(checked) => setValue("total_price", checked)}
                />
                {errors.total_price && <p className="text-red-500 text-xs">{errors.total_price.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80 h-28">
            <h3 className="text-lg font-semibold mb-4">Control</h3>
            <div className="flex items-center gap-2">
              <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
              <label className="text-sm font-medium">Active Status</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5 gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/inventory/products")}
          className="w-[500px] h-[42px] px-4 py-2 border rounded-tl-lg rounded-br-lg border-opacity-0"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-[500px] h-[42px] px-4 py-2 bg-blue-500 text-white rounded-tl-lg rounded-br-lg border-opacity-0"
        >
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
