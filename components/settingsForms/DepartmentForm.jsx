// @/components/settingsForms/DepartmentForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createDepartment, updateDepartment } from "@/actions/settings/departmentActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

// Define schema for form validation
const schema = z.object({
  department_name: z.string().min(1, { message: "Department Name is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

export default function DepartmentForm({ type, data }) {
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
      department_name: "",
      description: "",
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createDepartment : updateDepartment,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  // Set initial form values for editing
  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await formAction({ ...formData, id: data?._id || data?.id });
      if (!response.success) {
        state.message = response.message;
      }
    } catch (err) {
      state.message = err.message || "An unexpected error occurred.";
    }
  });

  // Toast notifications for success or error
  useEffect(() => {
    if (state.success) {
      toast.success(`Department ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/departments");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add Department" : "Edit Department"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Department Name</label>
          <Input {...register("department_name")} placeholder="Enter Department Name" />
          {errors.department_name && (
            <p className="text-red-500 text-xs">{errors.department_name.message}</p>
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
        <Button variant="outline" onClick={() => router.push("/settings/departments")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
