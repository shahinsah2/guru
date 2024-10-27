// @/components/settingsForms/StateForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createState, updateState } from "@/actions/stateActions"
import { getCountries } from "@/actions/countryActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

const schema = z.object({
  name: z.string().min(1, { message: "State name is required!" }),
  country: z.string().optional(),
  active_status: z.boolean().default(true),
})

const StateForm = ({ type, data, setOpen }) => {
  const [countriesOptions, setCountriesOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  })

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await getCountries()
        setCountriesOptions(countries)
    
      if (data) {
        // Match the country by name
        const matchedCountry = countries.find(
          (country) => country.name === data.country
        )

        reset({
          ...data,
          country: matchedCountry ? matchedCountry._id : "",
        })
      }
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch countries:", err)
        setError("Failed to load form data.")
        setLoading(false)
      }
    }
    fetchData()
  }, [data, reset])

  const [state, formAction] = useFormState(
    type === "create" ? createState : updateState,
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
      toast(`State ${type === "create" ? "created" : "updated"} successfully!`)
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new State" : "Edit State"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">State Name</label>
          <Input
            type="text"
            {...register("name")}
            className="w-full"
            placeholder="Enter state name"
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Country</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("country")}
          >
            <option value="">Select Country</option>
            {countriesOptions.map((country) => (
              <option key={country._id} value={country._id}>
                {country.name}
              </option>
            ))}
          </select>
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

export default StateForm
