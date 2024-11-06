// @/components/settingsForms/LeadChecklistForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createLeadChecklist, updateLeadChecklist } from "@/actions/settings/leadChecklistActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  checklist_name: z.string().min(1, { message: "Checklist Name is required!" }),
  description: z.string().optional(),
  checklist_qty: z.number().positive().int().min(1, { message: "Checklist Quantity must be a positive integer" }),
  active_status: z.boolean().default(true),
});

export default function LeadChecklistForm({ type, data }) {
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
      checklist_name: "",
      description: "",
      checklist_qty: 1,
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLeadChecklist : updateLeadChecklist,
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
    if (response && !response.success) {
      state.message = response.message;
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Lead Checklist ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/lead-checklist");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Lead Checklist" : "Edit Lead Checklist"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Checklist Name</label>
          <Input {...register("checklist_name")} placeholder="Enter Checklist Name" />
          {errors.checklist_name && (
            <p className="text-red-500 text-xs">{errors.checklist_name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea {...register("description")} placeholder="Enter Description" />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Checklist Quantity</label>
          <Input type="number" {...register("checklist_qty")} placeholder="Enter Checklist Quantity" />
          {errors.checklist_qty && (
            <p className="text-red-500 text-xs">{errors.checklist_qty.message}</p>
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
        <Button variant="outline" onClick={() => router.push("/settings/lead-checklist")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
