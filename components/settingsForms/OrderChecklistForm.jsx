// @/components/settingsForms/OrderChecklistForm.jsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createOrderChecklist, updateOrderChecklist } from "@/actions/settings/orderChecklistActions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  checklist_name: z.string().min(1, { message: "Checklist Name is required!" }),
  description: z.string().optional(),
  checklist_qty: z.number().positive().int().min(1, { message: "Checklist Quantity must be a positive integer" }),

  active_status: z.boolean().default(true),
});

export default function OrderChecklistForm({ type, data }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {
      checklist_name: "",
      description: "",
      checklist_qty: 1,
      active_status: true,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createOrderChecklist : updateOrderChecklist,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);
    }
  }, [type, data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    const parsedData = { ...formData, checklist_qty: Number(formData.checklist_qty) };
    const response = await formAction({ ...formData, id: data?._id });
    if (response && !response.success) {
        state.message = response.message;
      }
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Order Checklist ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/settings/order-checklist");
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);


  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setValue("checklist_qty", value ? parseInt(value, 10) : 1);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Order Checklist" : "Edit Order Checklist"}
      </h1>
      <div className=" bg-gray-200 p-6 border rounded-1g shadow-1g mb-6 flex  gap-40">
        {/* Branch Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex-2">
          {/* Branch ID and Branch Name */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
          <label className="text-sm font-medium">Checklist Name</label>
          <Input {...register("checklist_name")} placeholder="Enter Checklist Name" 
             className="w-full max-w-xs border border-gray-300 rounded-md p-2"/>
          {errors.checklist_name && (
            <p className="text-red-500 text-xs">{errors.checklist_name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea {...register("description")} placeholder="Enter Description"
             className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Checklist Qty</label>
                  <Input type="number" onChange={handleQuantityChange} placeholder="Enter Quantity"
                    className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
                  {errors.checklist_qty && (
                    <p className="text-red-500 text-xs">{errors.checklist_qty.message}</p>
                  )}
                </div>
              </div>
      </div>

        {/* Control Section */}
  
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-80 h-28">
            <h3 className="text-lg font-semibold mb-4">Control</h3>
            <div className="flex items-center gap-2">
              <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
              <label className="text-sm font-medium">Active Status</label>
            </div>
          </div>
      </div>

      <div className="flex justify-center mt-5 gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/settings/branches")}
          className="w-[500px] h-[42px] px-4 py-2 border rounded-tl-lg rounded-br-lg border-opacity-0"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-[500px] h-[42px] px-4 py-2 bg-blue-500 text-white rounded-tl-lg rounded-br-lg border-opacity-0"
        >
          {state.loading
            ? "Submitting..."
            : type === "create"
              ? "Create"
              : "Update"}
        </Button>
      </div>
    </form>
  );
}