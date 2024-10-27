// @/components/settingsForms/DepartmentForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createDepartment, updateDepartment } from "@/actions/departmentActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

// Define the schema for form validation
const schema = z.object({
  department_name: z.string().min(1, { message: "Department name is required!" }),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
})

const DepartmentForm = ({ type, data, setOpen }) => {
  const [loading, setLoading] = useState(true)
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
    setLoading(false)
  }, [data, reset])

  // Using useFormState for form action handling
  const [state, formAction] = useFormState(
    type === "create" ? createDepartment : updateDepartment,
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
      toast(`Department ${type === "create" ? "created" : "updated"} successfully!`)
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new department" : "Edit Department"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Department Name</label>
          <Input
            type="text"
            {...register("department_name")}
            className="w-full"
            placeholder="Enter department name"
          />
          {errors.department_name && (
            <p className="text-xs text-red-400">{errors.department_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Description</label>
          <Input
            type="text"
            {...register("description")}
            className="w-full"
            placeholder="Enter description"
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
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

export default DepartmentForm
