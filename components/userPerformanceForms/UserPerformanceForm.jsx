"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select"; // Assuming a Select component exists
import { createUserPerformance, updateUserPerformance } from "@/actions/user-performance/userPerformanceActions";
import { getActiveRoles, getDepartments } from "@/actions/settings/departmentActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Define schema for form validation
const schema = z.object({
  user_code: z.string().min(1, { message: "User Code is required!" }),
  user_name: z.string().min(1, { message: "User Name is required!" }),
  role: z.string().optional(),
  teamHead: z.string().optional(),
  department: z.string().optional(),
  joining_date: z.string().min(1, { message: "Joining Date is required!" }),
  performance_score: z.number().min(0, { message: "Score must be 0 or higher!" }).max(100, { message: "Score must be 100 or lower!" }),
});

const UserPerformanceForm = ({ type, data }) => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const router = useRouter();

  // Fetch roles and departments on mount
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [rolesData, departmentsData] = await Promise.all([
          getActiveRoles(),
          getDepartments(),
        ]);
  
        setRoles(rolesData);
        setDepartments(departmentsData);
  
        if (data) {
          reset({
            ...data,
            role: data.role?._id.toString(),
            department: data.department?._id.toString(),
          });
        }
      } catch (error) {
        toast.error("Failed to load form options!");
      }
    }
  
    fetchOptions();
  }, [data, reset]);
  

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">User Code</label>
          <Input
            {...register("user_code")}
            placeholder="Enter User Code"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.user_code && <p className="text-red-500 text-xs">{errors.user_code.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">User Name</label>
          <Input
            {...register("user_name")}
            placeholder="Enter User Name"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.user_name && <p className="text-red-500 text-xs">{errors.user_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            {...register("role")}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.role_name}
              </option>
            ))}
          </select>
          {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Department</label>
          <select
            {...register("department")}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.department_name}
              </option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Joining Date</label>
          <Input
            {...register("joining_date")}
            type="date"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.joining_date && <p className="text-red-500 text-xs">{errors.joining_date.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Performance Score</label>
          <Input
            {...register("performance_score", { valueAsNumber: true })}
            type="number"
            placeholder="Enter Performance Score"
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.performance_score && <p className="text-red-500 text-xs">{errors.performance_score.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
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
