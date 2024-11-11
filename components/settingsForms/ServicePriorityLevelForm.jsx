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

      <div className=" bg-gray-200 p-6 border rounded-1g shadow-1g mb-6 flex  gap-40">
        {/* Department Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-md flex-1">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Priority Level</label>
              <Input {...register("priority_level")} placeholder="Enter Priority Level" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
              {errors.priority_level && <p className="text-red-500 text-xs">{errors.priority_level.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input {...register("description")} placeholder="Enter Description"
                className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
            </div>
          </div>
        </div>

        {/* Control Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80 h-28">
            <h3 className="text-lg font-semibold mb-4">Control</h3>
            <div className="flex items-center gap-2">
              <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
              <label className="text-sm font-medium">Active Status</label>
            </div>
          </div>
      </div>

      <div className="flex justify-center mt-5 gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/settings/branches")}
          className="w-[500px] h-[42px] px-4 py-2 border rounded-tl-lg rounded-br-lg border-opacity-0"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-[500px] h-[42px] px-4 py-2 bg-blue-500 text-white rounded-tl-lg rounded-br-lg border-opacity-0"
        >
          {state.loading
            ? "Submitting..."
            : type === "create"
              ? "Create"
              : "Update"}
        </Button>
      </div>
    </form>
  );
}