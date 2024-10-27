// @/components/settingsForms/TermsAndConditionsForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createTermsAndConditions, updateTermsAndConditions } from "@/actions/termsAndConditionsActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

const schema = z.object({
  type: z.string().min(1, { message: "Type is required!" }),
  transactionType: z.string().min(1, { message: "Transaction type is required!" }),
  points: z.array(z.object({
    point: z.string().min(1, { message: "Point is required!" }),
    description: z.string().optional(),
  })).nonempty({ message: "At least one point is required!" }),
  active_status: z.boolean().default(true),
})

const TermsAndConditionsForm = ({ type: formType, data, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || { points: [{ point: "", description: "" }] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "points",
  })

  const router = useRouter()

  // Using useFormState for form action handling
  const [state, formAction] = useFormState(
    formType === "create" ? createTermsAndConditions : updateTermsAndConditions,
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
      toast(`Terms and conditions ${formType === "create" ? "created" : "updated"} successfully!`)
      setOpen(false)
      router.refresh()
    } else if (state.error) {
      setError(state.message)
      setLoading(false)
    }
  }, [state, router, formType, setOpen])

  const handleClose = () => {
    setOpen(false)
  }

  if (loading) {
    return <div className="text-center p-6">Loading...</div>
  }

  return (
    <form className="flex flex-col gap-8 p-4 w-96" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{formType === "create" ? "Create Terms and Conditions" : "Edit Terms and Conditions"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Type</label>
          <Input
            type="text"
            {...register("type")}
            className="w-full"
            placeholder="Enter type"
          />
          {errors.type && (
            <p className="text-xs text-red-400">{errors.type.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Transaction Type</label>
          <Input
            type="text"
            {...register("transactionType")}
            className="w-full"
            placeholder="Enter transaction type"
          />
          {errors.transactionType && (
            <p className="text-xs text-red-400">{errors.transactionType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Points</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <Input
                type="text"
                {...register(`points.${index}.point`)}
                placeholder="Point"
                className="w-2/3"
              />
              <Input
                type="text"
                {...register(`points.${index}.description`)}
                placeholder="Description"
                className="w-full"
              />
              <Button
                variant="outline"
                className="bg-red-500 text-white p-1"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          {errors.points && (
            <p className="text-xs text-red-400">{errors.points.message}</p>
          )}
          <Button
            type="button"
            className="mt-2 bg-green-500 text-white"
            onClick={() => append({ point: "", description: "" })}
          >
            Add Point
          </Button>
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
          {loading ? "Submitting..." : formType === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  )
}

export default TermsAndConditionsForm
