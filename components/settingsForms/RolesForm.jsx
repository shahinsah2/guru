// @/components/settingsForms/RolesForm.jsx
"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input"; // Shadcn UI Input component
import { createRole, updateRole } from "@/actions/roleActions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { getAllDepartments } from "@/actions/dataFetchActions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const schema = z.object({
  role_name: z.string().min(1, { message: "Role name is required!" }),
  department: z.string().optional(),
  active_status: z.boolean().default(true),
});

const RolesForm = ({ type, data, setOpen }) => {
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const router = useRouter();

  // Fetch departments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await getAllDepartments();
        setDepartmentsOptions(departments);

        if (data) {
          const matchedDepartment = departments.find(
            (dept) => dept.department_name === data.department
          );

          reset({
            ...data,
            department: matchedDepartment ? matchedDepartment._id : "",
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setError("Failed to load form data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [data, reset]);

  // Using useFormState for form action handling
  const [state, formAction] = useFormState(
    type === "create" ? createRole : updateRole,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  });

  // Handle success or error after submission
  useEffect(() => {
    if (state.success) {
      toast(`Role ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      setError(state.message);
      setLoading(false);
    }
  }, [state, router, type, setOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <form className="flex flex-col gap-8 p-4 w-96" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new role" : "Edit Role"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Role Name</label>
          <Input
            type="text"
            {...register("role_name")}
            className="w-full"
            placeholder="Enter role name"
          />
          {errors.role_name && (
            <p className="text-xs text-red-400">{errors.role_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Department</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("department")}
          >
            <option value="">Select Department</option>
            {departmentsOptions.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.department_name}
              </option>
            ))}
          </select>
          {errors.department?.message && <p className="text-xs text-red-400">{errors.department.message}</p>}
        </div>
      </div>

      {error && <span className="text-red-500">{error}</span>}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="bg-blue-400 text-white p-2 rounded-md" type="submit" disabled={loading}>
          {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default RolesForm;
