"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { createService, updateService } from "@/actions/operation/serviceAction";

const schema = z.object({
  image: z.any().optional(), // Image optional
  type: z.string().nonempty("Type is required!"),
  priority: z.string().nonempty("Priority is required!"),
  product_id: z.number().positive("Product ID must be a positive number!"),
  product_name: z.string().nonempty("Product Name is required!"),
  order_no: z.number().positive("Order No must be a positive number!"),
  client_id: z.number().positive("Client ID must be a positive number!"),
  amc: z.string().nonempty("AMC is required!"),
  sale_date: z
  .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
  .refine((val) => !!val, { message: "Delivery Challan Date is required!" }),
  client_name: z.string().nonempty("Client Name is required!"),
  service_head: z.string().nonempty("Service Head is required!"),
  service_staff: z.string().nonempty("Service Staff is required!"),
  service_receive_data: z
  .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
  .refine((val) => !!val, { message: "Delivery Challan Date is required!" }),
  start_date_time: z
  .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
  .refine((val) => !!val, { message: "Delivery Challan Date is required!" }),
  end_date_time: z
  .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined()))
  .refine((val) => !!val, { message: "Delivery Challan Date is required!" }),
  task_duration: z.string().nonempty("Task Duration is required!"),
  expense: z.number().positive("Expense must be a positive number!"),
});

const ServiceForm = ({ type, data }) => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(data?.image || null);
  const [tempImg, setTempImg] = useState(null);
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
    type === "create" ? createService : updateService,
    { success: false, error: false, message: "" }
  );

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
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

  useEffect(() => {
    if (state?.success) {
      toast.success(`Service ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/operation/service");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="w-full max-w-screen-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
    <h1 className="text-xl font-semibold">{type === "create" ? "Create Service" : "Edit Service"}</h1>
    <div className="bg-gray-200 p-6 border rounded-lg shadow-lg mb-6 flex flex-col gap-6">
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

        {/* Image Section */}
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

        {/* Dynamic Form Fields */}
        <div className="mb-4">
          <label className="text-sm font-medium">Type</label>
          <Input
            {...register("type")}
            placeholder="Enter Type"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Priority</label>
          <Input
            {...register("priority")}
            placeholder="Enter Priority"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.priority && <p className="text-red-500 text-xs">{errors.priority.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Product ID</label>
          <Input
            type="number"
            {...register("product_id", { valueAsNumber: true })}
            placeholder="Enter Product ID"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.product_id && <p className="text-red-500 text-xs">{errors.product_id.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Product Name</label>
          <Input
            {...register("product_name")}
            placeholder="Enter Product Name"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.product_name && <p className="text-red-500 text-xs">{errors.product_name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Order No</label>
          <Input
            type="number"
            {...register("order_no", { valueAsNumber: true })}
            placeholder="Enter Order No"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.order_no && <p className="text-red-500 text-xs">{errors.order_no.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Client ID</label>
          <Input
            type="number"
            {...register("client_id", { valueAsNumber: true })}
            placeholder="Enter Client ID"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.client_id && <p className="text-red-500 text-xs">{errors.client_id.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">AMC</label>
          <Input
            {...register("amc")}
            placeholder="Enter AMC"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.amc && <p className="text-red-500 text-xs">{errors.amc.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Sale Date</label>
          <Input
            type="date"
            {...register("sale_date")}
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.sale_date && <p className="text-red-500 text-xs">{errors.sale_date.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Client Name</label>
          <Input
            {...register("client_name")}
            placeholder="Enter Client Name"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.client_name && <p className="text-red-500 text-xs">{errors.client_name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Service Head</label>
          <Input
            {...register("service_head")}
            placeholder="Enter Service Head"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.service_head && <p className="text-red-500 text-xs">{errors.service_head.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Service Staff</label>
          <Input
            {...register("service_staff")}
            placeholder="Enter Service Staff"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.service_staff && <p className="text-red-500 text-xs">{errors.service_staff.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Service Receive Data</label>
          <Input
            type="date"
            {...register("service_receive_data")}
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.service_receive_data && <p className="text-red-500 text-xs">{errors.service_receive_data.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Start Date & Time</label>
          <Input
            type="datetime-local"
            {...register("start_date_time")}
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.start_date_time && <p className="text-red-500 text-xs">{errors.start_date_time.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">End Date & Time</label>
          <Input
            type="datetime-local"
            {...register("end_date_time")}
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.end_date_time && <p className="text-red-500 text-xs">{errors.end_date_time.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Task Duration</label>
          <Input
            {...register("task_duration")}
            placeholder="Enter Task Duration"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.task_duration && <p className="text-red-500 text-xs">{errors.task_duration.message}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Expense</label>
          <Input
            type="number"
            {...register("expense", { valueAsNumber: true })}
            placeholder="Enter Expense"
            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
          />
          {errors.expense && <p className="text-red-500 text-xs">{errors.expense.message}</p>}
        </div>

      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-4 mt-6">
      <Button variant="outline" onClick={() => router.push("/operation/service")}>
        Cancel
      </Button>
      <Button type="submit" className="bg-blue-500 text-white">
        {type === "create" ? "Create" : "Update"}
      </Button>
    </div>
  </form>
  );
};

export default ServiceForm;
