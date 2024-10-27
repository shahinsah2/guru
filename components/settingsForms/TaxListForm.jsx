// @/components/settingsForms/TaxListForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createTaxList, updateTaxList } from "@/actions/taxListActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

const schema = z.object({
  tax_name: z.string().min(1, { message: "Tax name is required!" }),
  percentage_cgst: z.number().min(0, { message: "CGST percentage is required!" }),
  percentage_sgst: z.number().min(0, { message: "SGST percentage is required!" }),
  active_status: z.boolean().default(true),
})

const TaxListForm = ({ type, data, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  })

  const router = useRouter()

  const [state, formAction] = useFormState(
    type === "create" ? createTaxList : updateTaxList,
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
      setLoading(false)
    }
  })

  useEffect(() => {
    if (state.success) {
      toast(`Tax ${type === "create" ? "created" : "updated"} successfully!`)
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new Tax" : "Edit Tax"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Tax Name</label>
          <Input
            type="text"
            {...register("tax_name")}
            className="w-full"
            placeholder="Enter tax name"
          />
          {errors.tax_name && (
            <p className="text-xs text-red-400">{errors.tax_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">CGST %</label>
          <Input
            type="number"
            {...register("percentage_cgst", { valueAsNumber: true })}
            className="w-full"
            placeholder="Enter CGST percentage"
          />
          {errors.percentage_cgst && (
            <p className="text-xs text-red-400">{errors.percentage_cgst.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">SGST %</label>
          <Input
            type="number"
            {...register("percentage_sgst", { valueAsNumber: true })}
            className="w-full"
            placeholder="Enter SGST percentage"
          />
          {errors.percentage_sgst && (
            <p className="text-xs text-red-400">{errors.percentage_sgst.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={watch("active_status")}
            onCheckedChange={(checked) => setValue("active_status", checked)}
          />
          <span>{watch("active_status") ? "Active" : "Inactive"}</span>
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

export default TaxListForm
