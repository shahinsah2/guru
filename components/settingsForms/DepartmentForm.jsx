//@/components/settingsForms/DepartmentForm.jsx

import { useForm } from "react-hook-form";
import { createDepartment, updateDepartment } from "@/actions/departmentActions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

const DepartmentForm = ({ type, data, setOpen }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data ? { ...data } : { department_name: "", description: "" }
  });

  const [state, formAction] = useFormState(
    type === "create" ? createDepartment : updateDepartment,
    { success: false, error: false, message: "" }
  );

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      await formAction({ ...formData, id: data?._id });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (state.success) {
      toast(`Department ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Failed to process the request.");
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new department" : "Update department"}</h1>

      {/* Department Name Field */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Department Name</label>
        <input
          className="border p-2 rounded-md text-sm"
          {...register("department_name", { required: "Department name is required!" })}
          placeholder="Enter department name"
        />
        {errors.department_name && <span className="text-red-500 text-xs">{errors.department_name.message}</span>}
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="border p-2 rounded-md text-sm"
          {...register("description")}
          placeholder="Enter description"
        />
      </div>

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

export default DepartmentForm;
