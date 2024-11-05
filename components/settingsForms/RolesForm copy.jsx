// @/components/RolesForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createRole, updateRole } from "@/actions/roleActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getDepartments } from "@/actions/departmentActions";

// Define schema for form validation
const schema = z.object({
  role_name: z.string().min(1, { message: "Role Name is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  active_status: z.boolean().default(true),
  module_access: z.array(z.object({
    module_name: z.string(),
    permissions: z.object({
      can_add: z.boolean().optional(),
      can_edit: z.boolean().optional(),
      can_delete: z.boolean().optional(),
      can_activate: z.boolean().optional(),
      can_deactivate: z.boolean().optional(),
      can_search: z.boolean().optional(),
      can_import: z.boolean().optional(),
      can_export: z.boolean().optional(),
      can_print: z.boolean().optional(),
      can_generate_pdf: z.boolean().optional(),
      can_logout: z.boolean().optional(),
    })
  }))
});

const RolesForm = ({ type, data }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });
  const router = useRouter();

  const [departments, setDepartments] = useState([]);
  const [modules, setModules] = useState([
    { module_name: "Users", permissions: { can_add: false, can_edit: false, can_delete: false } },
    { module_name: "Inventory", permissions: { can_add: false, can_edit: false, can_delete: false } },
    { module_name: "StockLocation", permissions: { can_add: false, can_edit: false, can_delete: false } },
  ]);

  // Fetch departments
  useEffect(() => {
    async function fetchDepartments() {
      const fetchedDepartments = await getDepartments();
      setDepartments(fetchedDepartments);
    }
    fetchDepartments();
  }, []);

  // Using useFormState for form actions
  const [state, formAction] = useFormState(
    type === "create" ? createRole : updateRole,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((formData) => {
    console.log("Submitted Form Data:", formData); // Debugging
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
      console.error("Error in form submission:", err);
    }
  });

  // Check form submission status to display success or error messages
  useEffect(() => {
    if (state.success) {
      toast.success(`Role ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/roles");
    } else if (state.error) {
      toast.error(state.message || "Failed to submit the form. Please try again.");
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Role" : "Edit Role"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Role Name</label>
          <Input {...register("role_name")} placeholder="Enter Role Name" />
          {errors.role_name && <p className="text-red-500 text-xs">{errors.role_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Department</label>
          <Select onValueChange={(value) => setValue("department", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(department => (
                <SelectItem key={department._id} value={department._id}>
                  {department.department_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Module Access Permissions</label>
        <div className="border p-4 rounded-md space-y-2">
          {modules.map((module, index) => (
            <div key={index} className="flex flex-col">
              <label className="font-medium">{module.module_name}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {Object.keys(module.permissions).map(permission => (
                  <div key={permission} className="flex items-center gap-2">
                    <Checkbox
                      {...register(`module_access.${index}.permissions.${permission}`)}
                      onChange={(e) => setValue(`module_access.${index}.permissions.${permission}`, e.target.checked)}
                      defaultChecked={module.permissions[permission]}
                    />
                    <label className="text-sm">{permission.replace(/_/g, ' ')}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox {...register("active_status")} />
        <label className="text-sm font-medium">Active Status</label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/settings/roles")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default RolesForm;
