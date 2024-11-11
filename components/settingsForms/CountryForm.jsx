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
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
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

  const activeStatus = watch("active_status");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add Country" : "Edit Country"}
      </h1>

      <div className=" bg-gray-200 p-6 border rounded-1g shadow-1g h-64 mb-6 flex  gap-40">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-md flex-1">
          <div>
            <label className="text-sm font-medium">Country Name</label>
            <Input {...register("name")} placeholder="Enter country name" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
        </div>

        {/* Control Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80 h-28">
          <h3 className="text-lg font-semibold mb-4">Control</h3>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={activeStatus}
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