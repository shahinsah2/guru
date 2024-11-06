// @/components/settingsForms/CountryForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createCountry, updateCountry } from "@/actions/settings/countryActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Country name is required!" }),
  active_status: z.boolean().default(true),
});

export default function CountryForm({ type, data }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || { name: "", active_status: true },
  });

  const router = useRouter();

  // Initialize form state using useFormState hook
  const [state, formAction] = useFormState(
    type === "create" ? createCountry : updateCountry,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  // Ensure reset only runs once when data changes
  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      state.message = err.message || "An unexpected error occurred.";
    }
  });

  // Check for success or error after formAction completes
  useEffect(() => {
    if (state.success) {
      toast.success(`Country ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/countries");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Country Name</label>
        <Input {...register("name")} placeholder="Enter country name" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox {...register("active_status")} />
        <label className="text-sm">Active Status</label>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/settings/countries")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
