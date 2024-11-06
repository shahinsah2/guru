// @/components/settingsForms/TermsForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createTerm, updateTerm } from "@/actions/settings/termsAndConditionsActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const pointSchema = z.object({
  point: z.string().min(1, { message: "Point is required!" }),
  description: z.string().optional(),
});

const schema = z.object({
  type: z.string().min(1, { message: "Type is required!" }),
  transactionType: z.string().min(1, { message: "Transaction Type is required!" }),
  points: z.array(pointSchema).nonempty({ message: "At least one point is required!" }),
  active_status: z.boolean().default(true),
});

export default function TermsForm({ type, data }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {
      type: "",
      transactionType: "",
      points: [{ point: "", description: "" }],
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createTerm : updateTerm,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const points = watch("points");

  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    const response = await formAction({ ...formData, id: data?._id });
    if (response && response.error) {
      state.message = response.message || "An error occurred";
      state.success = false;
      state.error = true;
    } else if (response && response.success) {
      state.message = "Terms saved successfully!";
      state.success = true;
      state.error = false;
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Terms ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/terms");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  const addPoint = () => {
    setValue("points", [...points, { point: "", description: "" }]);
  };

  const removePoint = (index) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setValue("points", updatedPoints);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Terms and Condition" : "Edit Terms and Condition"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Type</label>
          <Input {...register("type")} placeholder="Select Type" />
          {errors.type && (
            <p className="text-red-500 text-xs">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Transaction Type</label>
          <Input {...register("transactionType")} placeholder="Select Transaction Type" />
          {errors.transactionType && (
            <p className="text-red-500 text-xs">{errors.transactionType.message}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Points</label>
        {points.map((_, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Textarea
                {...register(`points.${index}.point`)}
                placeholder="Enter Point"
              />
              {errors.points?.[index]?.point && (
                <p className="text-red-500 text-xs">{errors.points[index].point.message}</p>
              )}
            </div>
            <div>
              <Textarea
                {...register(`points.${index}.description`)}
                placeholder="Enter Description"
              />
            </div>
            <Button variant="ghost" onClick={() => removePoint(index)} className="text-red-500">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addPoint} className="bg-blue-500 text-white mt-2">Add Point</Button>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          checked={watch("active_status")}
          onCheckedChange={(checked) => setValue("active_status", checked)}
        />
        <label className="text-sm font-medium">Active Status</label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/settings/terms")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
