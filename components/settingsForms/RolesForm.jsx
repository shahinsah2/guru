// @/components/settingsForms/RolesForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createRole, updateRole } from "@/actions/roleActions";
import { getDepartments } from "@/actions/departmentActions";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const permissionKeys = [
  "can_add", "can_edit", "can_delete", "can_activate", "can_deactivate",
  "can_search", "can_import", "can_export", "can_print",
  "can_generate_pdf", "can_logout"
];

const schema = z.object({
  role_name: z.string().min(1, { message: "Role Name is required!" }),
  department: z.string().min(1, { message: "Department is required!" }),
  module_access: z.array(z.object({
    module_name: z.string().min(1, { message: "Module name is required!" }),
    permissions: z.object(
      permissionKeys.reduce((acc, key) => {
        acc[key] = z.boolean().default(false);
        return acc;
      }, {})
    ),
  })),
});

const RolesForm = ({ type, data }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {
      role_name: "",
      department: "",
      module_access: [
        { module_name: "Users", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Roles", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Inventory", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Stock Location", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Grade", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Asset", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Item Variant", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Item Master", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Product Category", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Brands", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
        { module_name: "Product Template", permissions: permissionKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {}) },
      ],
    },
  });

  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const fetchedDepartments = await getDepartments();
        setDepartments(fetchedDepartments);
      } catch (err) {
        console.error("Failed to load departments:", err);
        setError("Failed to load departments.");
      }
    }
    fetchDepartments();
  }, []);

  // Set initial form values for editing
  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

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
      setLoading(false);
    }
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Role ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/roles");
      router.refresh();
    } else if (state?.error) {
      setError(state.message);
      setLoading(false);
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
          <Select onValueChange={(value) => setValue("department", value)} defaultValue={data?.department || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
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
        <div className="border p-4 rounded-md space-y-4">
          {watch("module_access").map((module, index) => (
            <div key={module.module_name} className="flex flex-col border-b pb-4">
              <label className="font-medium">{module.module_name}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {Object.keys(module.permissions).map((permission) => (
                  <div key={permission} className="flex items-center gap-2">
                    <Checkbox
                      {...register(`module_access.${index}.permissions.${permission}`)}
                      checked={watch(`module_access.${index}.permissions.${permission}`)}
                      onCheckedChange={(checked) => setValue(`module_access.${index}.permissions.${permission}`, checked)}
                    />
                    <label className="text-sm">{permission.replace(/_/g, ' ')}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/settings/roles")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
          {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default RolesForm;
