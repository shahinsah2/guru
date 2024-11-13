// @/components/groupLibraryForms/GroupForm.jsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createGroup, updateGroup } from "@/actions/inventory/groupActions";

const schema = z.object({
  group_name: z.string().nonempty("Group Name is required!"),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
});

const GroupForm = ({ type, data }) => {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "create") {
        await createGroup(formData);
      } else {
        await updateGroup({ ...formData, id: data?._id });
      }
      toast.success(`Group ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/inventory/group");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h1 className="text-xl font-semibold col-span-2">{type === "create" ? "Add Group" : "Edit Group"}</h1>

      <div className="col-span-2">
        <label className="text-sm font-medium">Group Name</label>
        <Input {...register("group_name")} placeholder="Enter Group Name" />
        {errors.group_name && <p className="text-red-500 text-xs">{errors.group_name.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="text-sm font-medium">Description</label>
        <Input {...register("description")} placeholder="Enter Description" />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      <div className="flex items-center gap-2 col-span-2">
        <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
        <label className="text-sm font-medium">Active Status</label>
      </div>

      <div className="col-span-2 flex justify-end">
        <Button
          variant="outline"
          onClick={() => router.push("/inventory/group")}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white mx-2">{type === "create" ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};

export default GroupForm;
