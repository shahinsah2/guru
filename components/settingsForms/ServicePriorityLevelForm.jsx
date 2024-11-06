// @/components/settingsForms/ServicePriorityLevelForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createServicePriorityLevel, updateServicePriorityLevel } from "@/actions/settings/servicePriorityLevelActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

const schema = z.object({
  priority_level: z.string().min(1, { message: "Priority Level is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

export default function ServicePriorityLevelForm({ type, data }) {
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
      priority_level: "",
      description: "",
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createServicePriorityLevel : updateServicePriorityLevel,
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
    try {
      const response = await formAction({ ...formData, id: data?._id });
      if (!response.success) {
        state.message = response.message;
      }
    } catch (err) {
      state.message = err.message || "An unexpected error occurred.";
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Priority Level ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/service-priority-level");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Add Priority Level" : "Edit Priority Level"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Priority Level</label>
          <Input {...register("priority_level")} placeholder="Enter Priority Level" />
          {errors.priority_level && <p className="text-red-500 text-xs">{errors.priority_level.message}</p>}
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
        <Button variant="outline" onClick={() => router.push("/settings/service-priority-level")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
