// @/components/settingsForms/BranchForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createBranch, updateBranch } from "@/actions/settings/branchActions";
import { getStates } from "@/actions/settings/stateActions";
import { getCountries } from "@/actions/settings/countryActions";
import { getCities } from "@/actions/settings/cityActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  branch_id: z.string().min(1, { message: "Branch ID is required!" }),
  branch_name: z.string().min(1, { message: "Branch name is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  pincode: z.string().min(1, { message: "Pincode is required!" }),
  country: z.string().min(1, { message: "Country is required!" }),
  state: z.string().min(1, { message: "State is required!" }),
  city: z.string().min(1, { message: "City is required!" }),
  active_status: z.boolean().default(true),
});

export default function BranchForm({ type, data }) {
  const router = useRouter();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

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
      branch_id: "",
      branch_name: "",
      address: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createBranch : updateBranch,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    async function fetchData() {
      const fetchedCountries = await getCountries();
      const fetchedStates = await getStates();
      const fetchedCities = await getCities();
      setCountries(fetchedCountries);
      setStates(fetchedStates);
      setCities(fetchedCities);

      if (data) {
        reset({
          ...data,
          country: data.country?._id,
          state: data.state?._id,
          city: data.city?._id,
        });
      }
    }
    fetchData();
  }, [data, reset]);

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
      toast.success(
        `Branch ${type === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/settings/branches");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold mb-8">
        {type === "create" ? "Add Branch" : "Edit Branch"}
      </h1>

      <div className="flex flex-wrap gap-8 justify-between mb-3">
        {/* Branch Details Section */}
        <div className="bg-white p-6 rounded-lg shadow border w-full max-w-md flex-1">
          <h2 className="text-lg font-semibold mb-4">Branch Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Branch ID</label>
              <Input {...register("branch_id")} placeholder="Enter branch ID" />
              {errors.branch_id && (
                <p className="text-red-500 text-xs">
                  {errors.branch_id.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Branch Name</label>
              <Input
                {...register("branch_name")}
                placeholder="Enter branch name"
              />
              {errors.branch_name && (
                <p className="text-red-500 text-xs">
                  {errors.branch_name.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow border w-full max-w-md flex-1">
          <h2 className="text-lg font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Pincode</label>
              <Input {...register("pincode")} placeholder="Enter pincode" />
              {errors.pincode && (
                <p className="text-red-500 text-xs">{errors.pincode.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Select
                onValueChange={(value) => setValue("country", value)}
                value={watch("country") || ""}
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
              {errors.country && (
                <p className="text-red-500 text-xs">{errors.country.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Select
                onValueChange={(value) => setValue("state", value)}
                value={watch("state") || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Select
                onValueChange={(value) => setValue("city", value)}
                value={watch("city") || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city._id} value={city._id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input {...register("address")} placeholder="Enter address" />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Control Section */}
        <div className="bg-white p-6 rounded-lg shadow border w-1/4 max-w-md flex-1">
          <h2 className="text-lg font-semibold mb-4">Control</h2>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              checked={watch("active_status")}
              onCheckedChange={(checked) => setValue("active_status", checked)}
            />
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
