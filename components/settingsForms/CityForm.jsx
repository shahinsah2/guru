// @/components/settingsForms/CityForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createCity, updateCity } from "@/actions/settings/cityActions";
import { getStates } from "@/actions/settings/stateActions";
import { getCountries } from "@/actions/settings/countryActions";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "City name is required!" }),
  state: z.string().min(1, { message: "State is required!" }),
  country: z.string().min(1, { message: "Country is required!" }),
  active_status: z.boolean().default(true),
});

export default function CityForm({ type, data }) {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || { name: "", state: "", country: "", active_status: true },
  });

  const router = useRouter();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  // Initialize form state using useFormState hook
  const [state, formAction] = useFormState(
    type === "create" ? createCity : updateCity,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  // Fetch all countries and states on component mount
  useEffect(() => {
    async function fetchData() {
      const fetchedCountries = await getCountries();
      const fetchedStates = await getStates();
      setCountries(fetchedCountries);
      setStates(fetchedStates);
    }
    fetchData();
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
      toast.success(`City ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/cities");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  // Filter states based on selected country
  const selectedCountry = watch("country");
  const filteredStates = selectedCountry
    ? states.filter((state) => state.country === selectedCountry)
    : [];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">City Name</label>
        <Input {...register("name")} placeholder="Enter city name" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Country</label>
        <Select
          onValueChange={(value) => setValue("country", value)}
          defaultValue={data?.country || ""}
        >
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

      <div>
        <label className="text-sm font-medium">State</label>
        <Select onValueChange={(value) => setValue("state", value)} defaultValue={data?.state || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {filteredStates.map((state) => (
              <SelectItem key={state._id} value={state._id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox {...register("active_status")} />
        <label className="text-sm">Active Status</label>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/settings/cities")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {state.loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
}
