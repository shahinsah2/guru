// @/components/settingsForms/RolesForm.jsx

import { useForm } from "react-hook-form";
import { createRole, updateRole } from "@/actions/roleActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const permissionsList = [
  'can_add', 'can_edit', 'can_delete', 'can_activate', 'can_deactivate',
  'can_search', 'can_import', 'can_export', 'can_print', 'can_generate_pdf', 'can_logout'
];

const moduleNameList = [
    'Users', 'TaxList', 'Department', 'Branches', 'Inventory'    
  ];

const RolesForm = ({ type, data, departmentsOptions = [],setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data ? {
      ...data,
      module_access: data.module_access || [],
      module_name: data.module_access?.[0]?.module_name || "", // Set default module_name
    } : {
      role_name: "",
      department: "",
      module_access: [],
      module_name: "", // Initialize module_name
    }
  });

  const router = useRouter();

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const moduleAccessArray = [
        {
          module_name: formData.module_name,
          permissions: permissionsList.reduce((acc, permission) => {
            acc[permission] = formData[permission] || false;
            return acc;
          }, {})
        }
      ];

      const roleData = {
        role_name: formData.role_name,
        department: formData.department,
        module_access: moduleAccessArray
      };

      const result = type === "create"
        ? await createRole(roleData)
        : await updateRole(data._id, roleData);

      if (result.success) {
        toast(`Role ${type === "create" ? "created" : "updated"} successfully!`);
        setOpen(false);
        router.refresh();
      } else {
        setError(result.message || "Failed to process the request.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new role" : "Update role"}</h1>

      {/* Role Name Field */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Role Name</label>
        <input
          className="border p-2 rounded-md text-sm"
          {...register("role_name", { required: "Role name is required!" })}
          placeholder="Enter role name"
        />
        {errors.role_name && <span className="text-red-500 text-xs">{errors.role_name.message}</span>}
      </div>

      {/* Department Selection */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Department</label>
        <select
          className="border p-2 rounded-md text-sm"
          {...register("department", { required: "Department is required!" })}
        >
          <option value="">Select a department</option>
          {departmentsOptions.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.department_name}
            </option>
          ))}
        </select>
        {errors.department && <span className="text-red-500 text-xs">{errors.department.message}</span>}
      </div>

       {/* Module Name Selection */}
       <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Module Name</label>
        <select
          className="border p-2 rounded-md text-sm"
          {...register("module_name", { required: "Module name is required!" })}
        >
          <option value="">Select a module</option>
          {moduleNameList.map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>
        {errors.module_name && <span className="text-red-500 text-xs">{errors.module_name.message}</span>}
      </div>

      {/* Module Access Permissions */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Module Access</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {permissionsList.map((permission) => (
            <div key={permission} className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(permission)}
                defaultChecked={data?.module_access?.[0]?.permissions?.[permission] || false}
                className="form-checkbox"
              />
              <label className="text-sm">{permission.replace('_', ' ')}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && <span className="text-red-500 text-sm">{error}</span>}

      {/* Submit Button */}
      <button
        type="submit"
        className={`bg-blue-500 text-white p-2 rounded-md mt-4 ${loading ? "opacity-50" : ""}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default RolesForm;
