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
      formAction({...formData, id: data?._id});
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
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Grade" : "Edit Grade"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Grade ID</label>
          <Input {...register("grade_id")} placeholder="Enter Grade ID" />
          {errors.grade_id && <p className="text-red-500 text-xs">{errors.grade_id.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Grade Name</label>
          <Input {...register("grade_name")} placeholder="Enter Grade Name" />
          {errors.grade_name && <p className="text-red-500 text-xs">{errors.grade_name.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Input {...register("description")} placeholder="Enter Description" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          checked={watch("active_status")}
          onCheckedChange={(checked) => setValue("active_status", checked)}
        />
        <label className="text-sm font-medium">Active Status</label>
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
