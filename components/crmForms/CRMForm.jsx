"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createContact, updateContact } from "@/actions/crm/contactActions"; // Replace with actual actions
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Define schema for form validation
const schema = z.object({
  contact_number: z.string().min(1, { message: "Contact Number is required!" }),
  contact_name: z.string().min(1, { message: "Contact Name is required!" }),
  email: z.string().email({ message: "Invalid email format!" }),
  phone: z.string().optional(),
  active_status: z.boolean().default(true),
});

const CRMForm = ({ type, data }) => {
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

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        await createContact(formData);
        toast.success("Contact created successfully!");
      } else {
        await updateContact({ ...formData, id: data?._id });
        toast.success("Contact updated successfully!");
      }
      router.push("/crm/contact");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit the form.");
    }
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <form
      className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add New Contact" : "Edit Contact"}
      </h1>

      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6 flex gap-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <Input
              {...register("contact_number")}
              placeholder="Enter Contact Number"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-xs">{errors.contact_number.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Contact Name</label>
            <Input
              {...register("contact_name")}
              placeholder="Enter Contact Name"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.contact_name && (
              <p className="text-red-500 text-xs">{errors.contact_name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              {...register("email")}
              placeholder="Enter Email"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              {...register("phone")}
              placeholder="Enter Phone Number"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Active Status Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-64 h-32">
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/crm/contact")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default CRMForm;
