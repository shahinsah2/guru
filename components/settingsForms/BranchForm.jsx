//  @/components/settingsForms/BranchForm.jsx

import { useForm } from "react-hook-form";
import { createBranch, updateBranch } from "@/actions/branchActions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

const BranchForm = ({ type, data, setOpen }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: data ? { ...data } : { branchid: "", branch_name: "", address: {} }
  });

  const [state, formAction] = useFormState(
    type === "create" ? createBranch : updateBranch,
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
      toast(`Branch ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message || "Failed to process the request.");
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new branch" : "Update branch"}</h1>

      {/* Branch ID Field */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Branch ID</label>
        <input
          className="border p-2 rounded-md text-sm"
          {...register("branchid", { required: "Branch ID is required!" })}
          placeholder="Enter branch ID"
        />
        {errors.branchid && <span className="text-red-500 text-xs">{errors.branchid.message}</span>}
      </div>

      {/* Branch Name Field */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Branch Name</label>
        <input
          className="border p-2 rounded-md text-sm"
          {...register("branch_name", { required: "Branch name is required!" })}
          placeholder="Enter branch name"
        />
        {errors.branch_name && <span className="text-red-500 text-xs">{errors.branch_name.message}</span>}
      </div>

      {/* Address Fields */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Address</label>
        <input
          className="border p-2 rounded-md text-sm"
          {...register("address.pincode")}
          placeholder="Pincode"
        />
        <input
          className="border p-2 rounded-md text-sm mt-2"
          {...register("address.country")}
          placeholder="Country"
        />
        <input
          className="border p-2 rounded-md text-sm mt-2"
          {...register("address.state")}
          placeholder="State"
        />
        <input
          className="border p-2 rounded-md text-sm mt-2"
          {...register("address.city")}
          placeholder="City"
        />
        <input
          className="border p-2 rounded-md text-sm mt-2"
          {...register("address.address")}
          placeholder="Street Address"
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

export default BranchForm;
