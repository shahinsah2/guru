// @/components/settingsForms/StateForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createState, updateState } from "@/actions/settings/stateActions";
import { getCountries } from "@/actions/settings/countryActions";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "State name is required!" }),
  country: z.string().min(1, { message: "Country is required!" }),
  active_status: z.boolean().default(true),
});

export default function StateForm({ type, data }) {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || { name: "", country: "", active_status: true },
  });

  const router = useRouter();
  const [countries, setCountries] = useState([]);
  
  // Initialize form state using useFormState hook
  const [state, formAction] = useFormState(
    type === "create" ? createState : updateState,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  // Fetch countries for the select dropdown
  useEffect(() => {
    async function fetchCountries() {
      const fetchedCountries = await getCountries();
      setCountries(fetchedCountries);
    }
    fetchCountries();
  }, []);

  // Set initial form values for editing
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

  useEffect(() => {
    if (state.success) {
      toast.success(`State ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/states");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">State Name</label>
        <Input {...register("name")} placeholder="Enter state name" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Country</label>
        <Select onValueChange={(value) => setValue("country", value)} defaultValue={data?.country || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country._id} value={country._id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox {...register("active_status")} />
        <label className="text-sm">Active Status</label>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/settings/states")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
