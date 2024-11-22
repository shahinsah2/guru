"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createUserPerformance, updateUserPerformance } from "@/actions/user-performance/userPerformanceActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Define schema for form validation
const schema = z.object({
  performance_number: z.string().min(1, { message: "Performance Number is required!" }),
  user_name: z.string().min(1, { message: "User Name is required!" }),
  performance_score: z.number().min(0, { message: "Score must be 0 or higher!" }).optional(),
  active_status: z.boolean().default(true),
});

const UserPerformanceForm = ({ type, data }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        await createUserPerformance(formData);
        toast.success("User performance created successfully!");
      } else {
        await updateUserPerformance({ ...formData, id: data?._id });
        toast.success("User performance updated successfully!");
      }
      router.push("/user-performance/user");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save user performance data!");
    }
  });

  return (
    <form className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add New User Performance" : "Edit User Performance"}</h1>

      <div className="bg-gray-50 p-6 border rounded-lg shadow-md mb-6 flex gap-10">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Performance Number</label>
            <Input
              {...register("performance_number")}
              placeholder="Enter Performance Number"
              className="w-full max-w-xs border border-gray-300 rounded-md p-2"
            />
            {errors.performance_number && <p className="text-red-500 text-xs">{errors.performance_number.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">User Name</label>
            <Input
              {...register("user_name")}
              placeholder="Enter User Name"
              className="w-full max-w-xs border border-gray-300 rounded-md p-2"
            />
            {errors.user_name && <p className="text-red-500 text-xs">{errors.user_name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Performance Score</label>
            <Input
              {...register("performance_score", { valueAsNumber: true })}
              placeholder="Enter Performance Score"
              className="w-full max-w-xs border border-gray-300 rounded-md p-2"
              type="number"
            />
            {errors.performance_score && <p className="text-red-500 text-xs">{errors.performance_score.message}</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80">
          <h3 className="text-lg font-semibold mb-4">Control</h3>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={watch("active_status")}
              onCheckedChange={(checked) => setValue("active_status", checked)}
            />
            <label className="text-sm font-medium">Active Status</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/user-performance/user")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default UserPerformanceForm;
