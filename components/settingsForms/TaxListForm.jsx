// @/components/settingsForms/TaxListForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createTaxList, updateTaxList } from "@/actions/settings/taxListActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  tax_name: z.string().min(1, { message: "Tax Name is required!" }),
  percentage_cgst: z.number().min(0, { message: "CGST percentage is required!" }).max(100),
  percentage_sgst: z.number().min(0, { message: "SGST percentage is required!" }).max(100),
  active_status: z.boolean().default(true),
});

export default function TaxListForm({ type, data }) {
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
      tax_name: "",
      percentage_cgst: 0,
      percentage_sgst: 0,
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createTaxList : updateTaxList,
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
      state.message = response.message || "An error occurred";
      state.success = false;
      state.error = true;
    } else if (response && response.success) {
      state.message = `Tax List ${type === "create" ? "created" : "updated"} successfully!`;
      state.success = true;
      state.error = false;
    }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Tax List ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/tax-list");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Tax List" : "Edit Tax List"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tax Name</label>
          <Input {...register("tax_name")} placeholder="Enter Tax Name" />
          {errors.tax_name && (
            <p className="text-red-500 text-xs">{errors.tax_name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Percentage CGST</label>
          <Input
            {...register("percentage_cgst", { valueAsNumber: true })}
            type="number"
            placeholder="0%"
          />
          {errors.percentage_cgst && (
            <p className="text-red-500 text-xs">{errors.percentage_cgst.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Percentage SGST</label>
          <Input
            {...register("percentage_sgst", { valueAsNumber: true })}
            type="number"
            placeholder="0%"
          />
          {errors.percentage_sgst && (
            <p className="text-red-500 text-xs">{errors.percentage_sgst.message}</p>
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
        <Button variant="outline" onClick={() => router.push("/settings/tax-list")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
