// @/components/settingsForms/LeadChecklistForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createLeadChecklist, updateLeadChecklist } from "@/actions/leadChecklistActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

const schema = z.object({
  checklist_name: z.string().min(1, { message: "Checklist name is required!" }),
  description: z.string().optional(),
  checklist_qty: z.string({ message: "Quantity should be a positive number!" }),
  active_status: z.boolean().default(true),
})

const LeadChecklistForm = ({ type, data, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  })

  const router = useRouter()

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const [state, formAction] = useFormState(
    type === "create" ? createLeadChecklist : updateLeadChecklist,
    {
      success: false,
      error: false,
      message: "",
    }
  )

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true)
    try {
      formAction({ ...formData, id: data?._id })
    } catch (err) {
      setError(err.message || "An unexpected error occurred.")
    }
  })

  useEffect(() => {
    if (state.success) {
      toast(`Lead Checklist ${type === "create" ? "created" : "updated"} successfully!`)
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

  return (
    <form className="flex flex-col gap-8 p-4 w-96" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new lead checklist" : "Edit Lead Checklist"}</h1>

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
          <label className="text-xs text-gray-500">Description</label>
          <Input
            type="text"
            {...register("description")}
            className="w-full"
            placeholder="Enter description"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Quantity</label>
          <Input
            type="Number"
            {...register("checklist_qty")}
            className="w-full"
            placeholder="Enter quantity"
          />
          {errors.checklist_qty && (
            <p className="text-xs text-red-400">{errors.checklist_qty.message}</p>
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

export default LeadChecklistForm
