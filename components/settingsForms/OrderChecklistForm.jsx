// @/components/settingsForms/OrderChecklistForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createOrderChecklist, updateOrderChecklist } from "@/actions/orderChecklistActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"


const schema = z.object({
  checklist_name: z.string().min(1, { message: "Checklist name is required!" }),
  checklist_qty: z.number().min(1, { message: "Quantity is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
})

const OrderChecklistForm = ({ type, data, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  })

  const router = useRouter()

  // Using useFormState for form action handling
  const [state, formAction] = useFormState(
    type === "create" ? createOrderChecklist : updateOrderChecklist,
    {
      success: false,
      error: false,
      message: "",
    }
  )

  const onSubmit = handleSubmit(async (formData) => {
   
    setLoading(true);
    try {
      // Explicitly parse checklist_qty to a number and active_status to a boolean
      const parsedData = {
        ...formData,        
        active_status: Boolean(formData.active_status),
      };
  
      // Call formAction with parsed data
      formAction({ ...parsedData, id: data?._id });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  });

  // Handle success or error after submission
  useEffect(() => {
    if (state.success) {
      toast(`Checklist ${type === "create" ? "created" : "updated"} successfully!`)
      setOpen(false)
      router.refresh()
    } else if (state.error) {
      setError(state.message)
      setLoading(false)
    }
  }, [state, router, type, setOpen])

  const handleClose = () => {
    setOpen(false)
  }

  if (loading) {
    return <div className="text-center p-6">Loading...</div>
  }

  return (
    <form className="flex flex-col gap-8 p-4 w-96" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new checklist" : "Edit Checklist"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Checklist Name</label>
          <Input
            type="text"
            {...register("checklist_name")}
            className="w-full"
            placeholder="Enter checklist name"
          />
          {errors.checklist_name && (
            <p className="text-xs text-red-400">{errors.checklist_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Quantity</label>
          <Input
            type="number"
            {...register("checklist_qty", { valueAsNumber: true })}
            className="w-full"
            placeholder="Enter quantity"
          />
          {errors.checklist_qty && (
            <p className="text-xs text-red-400">{errors.checklist_qty.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            {...register("description")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Enter description"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500">Active Status</label>
            <div className="flex items-center gap-2">
          <Checkbox
            checked={watch("active_status")}
            onCheckedChange={(checked) => setValue("active_status", checked)}
          />
          <span>{watch("active_status") ? "Active" : "Inactive"}</span>
        </div>
            {errors.active_status && (
                <p className="text-xs text-red-400">{errors.active_status.message}</p>
            )}
        </div>

      </div>

      {error && <span className="text-red-500">{error}</span>}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="bg-blue-400 text-white p-2 rounded-md" type="submit" disabled={loading}>
          {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  )
}

export default OrderChecklistForm
