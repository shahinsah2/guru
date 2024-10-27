// @/components/settingsForms/BranchForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createBranch, updateBranch } from "@/actions/branchActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

// Define the schema for form validation
const schema = z.object({
  branchid: z.string().min(1, { message: "Branch ID is required!" }),
  branch_name: z.string().min(1, { message: "Branch name is required!" }),
  address: z.object({
    pincode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
})

const BranchForm = ({ type, data, setOpen }) => {
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
    type === "create" ? createBranch : updateBranch,
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
      toast(`Branch ${type === "create" ? "created" : "updated"} successfully!`)
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new branch" : "Edit Branch"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Branch ID</label>
          <Input
            type="text"
            {...register("branchid")}
            className="w-full"
            placeholder="Enter branch ID"
          />
          {errors.branchid && (
            <p className="text-xs text-red-400">{errors.branchid.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Branch Name</label>
          <Input
            type="text"
            {...register("branch_name")}
            className="w-full"
            placeholder="Enter branch name"
          />
          {errors.branch_name && (
            <p className="text-xs text-red-400">{errors.branch_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Address</label>
          <Input
            type="text"
            {...register("address.address")}
            className="w-full"
            placeholder="Enter address"
          />
          <Input
            type="text"
            {...register("address.city")}
            className="w-full"
            placeholder="Enter city"
          />
          <Input
            type="text"
            {...register("address.state")}
            className="w-full"
            placeholder="Enter state"
          />
          <Input
            type="text"
            {...register("address.country")}
            className="w-full"
            placeholder="Enter country"
          />
          <Input
            type="text"
            {...register("address.pincode")}
            className="w-full"
            placeholder="Enter pincode"
          />
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

export default BranchForm
