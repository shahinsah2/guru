// @/components/settingsForms/ServiceStatusForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createServiceStatus, updateServiceStatus } from "@/actions/serviceStatusActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  status_name: z.string().min(1, { message: "Service Status is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

export default function ServiceStatusForm({ type, data }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {
      status_name: "",
      description: "",
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createServiceStatus : updateServiceStatus,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    const response = await formAction({ ...formData, id: data?._id });
    if (response && response.error) {
      state.message = response.message || 'An error occurred';
      state.success = false;
      state.error = true;
    } else if (response && response.success) {
      state.message = "Service Status saved successfully!";
      state.success = true;
      state.error = false;
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Service Status ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/service-status");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Service Status" : "Edit Service Status"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Service Status</label>
          <Input {...register("status_name")} placeholder="Enter Service Status" />
          {errors.status_name && (
            <p className="text-red-500 text-xs">{errors.status_name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea {...register("description")} placeholder="Enter Description" />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
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
        <Button variant="outline" onClick={() => router.push("/settings/service-status")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
