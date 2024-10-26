// @/components/settingsForms/UsersForm.jsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import { createUser, updateUser } from "@/actions/userActions"; // Import updateUser
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

// Define the schema for form validation
const schema = z.object({
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().optional(),
  login_id: z.string().min(3, { message: "Login ID must be at least 3 characters long!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }),
  emailid: z.string().email({ message: "Invalid email address!" }).optional(),
  phone_number: z.string().optional(),
  user_code: z.string().optional(),
  joining_date: z.string().optional(),
  active_status: z.boolean().default(true),
  clerkid: z.string().optional(),
  roles: z.array(z.string()).min(1, { message: "At least one role is required!" }),
  departments: z.array(z.string()).optional(),
  branches: z.array(z.string()).optional(),
  address: z.object({
    pincode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    landmark: z.string().optional(),
    street: z.string().optional(),
  }).optional(),
  team_head: z.string().optional(),
});

const UsersForm = ({
  type,
  data,
  rolesOptions = [],
  departmentsOptions = [],
  branchesOptions = [],
  teamHeadOptions = [],
  setOpen,
}) => {
  const [loading, setLoading] = useState(false); // State for tracking loading
  const [error, setError] = useState(null); // State for tracking errors

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data
      ? {
          ...data,
          joining_date: data.joining_date ? new Date(data.joining_date).toISOString().split("T")[0] : "",
          roles: data.roles?.map((role) => role._id) || [],
          departments: data.departments?.map((dept) => dept._id) || [],
          branches: data.branches?.map((branch) => branch._id) || [],
        }
      : {},
  });

 

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      console.log("Form Data:", formData); // Log the form data

      // Determine whether to create or update
      const result =
        type === "create"
          ? await createUser(formData) // Call createUser if type is "create"
          : await updateUser(data._id, formData); // Call updateUser if type is "update"

      if (result.success) {
        toast(`User ${type === "create" ? "created" : "updated"} successfully!`);
        setOpen(false); // Close the modal
        router.refresh(); // Refresh the page or data
      } else {
        setError(result.message || "Failed to process the request. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new user" : "Update user"}</h1>

      {/* User Info Section */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="first_name"
          defaultValue={data?.first_name}
          register={register}
          error={errors.first_name}
        />
        <InputField
          label="Last Name"
          name="last_name"
          defaultValue={data?.last_name}
          register={register}
          error={errors.last_name}
        />
        <InputField
          label="Login ID"
          name="login_id"
          defaultValue={data?.login_id}
          register={register}
          error={errors.login_id}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors.password}
        />
        <InputField
          label="Email"
          name="emailid"
          defaultValue={data?.emailid}
          register={register}
          error={errors.emailid}
        />
        <InputField
          label="Phone Number"
          name="phone_number"
          defaultValue={data?.phone_number}
          register={register}
          error={errors.phone_number}
        />
        <InputField
          label="Joining Date"
          name="joining_date"
          defaultValue={data?.joining_date}
          register={register}
          error={errors.joining_date}
          type="date"
        />
        <InputField
          label="User Code"
          name="user_code"
          defaultValue={data?.user_code}
          register={register}
          error={errors.user_code}
        />
      </div>

      {/* Address Section */}
      <span className="text-xs text-gray-400 font-medium">Address</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="Pincode" name="address.pincode" defaultValue={data?.address?.pincode} register={register} error={errors?.address?.pincode} />
        <InputField label="Country" name="address.country" defaultValue={data?.address?.country} register={register} error={errors?.address?.country} />
        <InputField label="State" name="address.state" defaultValue={data?.address?.state} register={register} error={errors?.address?.state} />
        <InputField label="City" name="address.city" defaultValue={data?.address?.city} register={register} error={errors?.address?.city} />
        <InputField label="Landmark" name="address.landmark" defaultValue={data?.address?.landmark} register={register} error={errors?.address?.landmark} />
        <InputField label="Street" name="address.street" defaultValue={data?.address?.street} register={register} error={errors?.address?.street} />
      </div>

      {/* Roles, Departments, Branches */}
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Roles</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("roles")} multiple>
            {rolesOptions.map((role) => (
              <option key={role._id} value={role._id}>
                {role.role_name}
              </option>
            ))}
          </select>
          {errors.roles?.message && <p className="text-xs text-red-400">{errors.roles.message}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Departments</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("departments")} multiple>
            {departmentsOptions.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.department_name}
              </option>
            ))}
          </select>
          {errors.departments?.message && <p className="text-xs text-red-400">{errors.departments.message}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Branches</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("branches")} multiple>
            {branchesOptions.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          {errors.branches?.message && <p className="text-xs text-red-400">{errors.branches.message}</p>}
        </div>
      </div>

      {/* Error Message */}
      {error && <span className="text-red-500">{error}</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md" disabled={loading}>
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default UsersForm;
