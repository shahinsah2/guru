// @/components/productLibraryForms/GradeForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createGrade, updateGrade } from "@/actions/productLibrary/gradeActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const schema = z.object({
  grade_id: z.string().min(1, { message: "Grade ID is required!" }),
  grade_name: z.string().min(1, { message: "Grade name is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

const GradeForm = ({ type, data }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createGrade : updateGrade,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
    try {
      formAction({ ...formData, id: data?._id });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(`Grade ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/product-library/grade");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create Grade  " : "Edit Product Category"}
        </h1>

        {/* Category Information and Active Status Side by Side */}
        <div className=" flex flex-col md:flex-row gap-6">

          {/* Category Information Fields */}
          <div className="bg-gray-50 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Grade ID</label>
              <Input {...register("grade_id")} placeholder="Enter Grade ID" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
              {errors.grade_id && <p className="text-red-500 text-xs">{errors.grade_id.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Grade Name</label>
              <Input {...register("grade_name")} placeholder="Enter Grade Name" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
              {errors.grade_name && <p className="text-red-500 text-xs">{errors.grade_name.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Input {...register("description")} placeholder="Enter Description" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          {/* Active Status Section */}
          <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Control</h3>
            <div className="flex items-center gap-2">
              <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
              <label className="text-sm font-medium">Active Status</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/product-library/grade")}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default GradeForm;