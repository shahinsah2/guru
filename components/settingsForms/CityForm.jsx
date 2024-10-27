// @/components/settingsForms/CityForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createCity, updateCity } from "@/actions/cityActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { getAllStates, getAllCountries } from "@/actions/dataFetchActions"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

const schema = z.object({
  name: z.string().min(1, { message: "City name is required!" }),
  state: z.string().min(1, { message: "State is required!" }),
  country: z.string().min(1, { message: "Country is required!" }),
  active_status: z.boolean().default(true),
})

const CityForm = ({ type, data, setOpen }) => {
  const [statesOptions, setStatesOptions] = useState([])
  const [countriesOptions, setCountriesOptions] = useState([])
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
    const fetchData = async () => {
      try {
        const [states, countries] = await Promise.all([
          getAllStates(),
          getAllCountries(),
        ])

        setStatesOptions(states)
        setCountriesOptions(countries)

        if (data) {
          reset(data)
        }
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch states or countries:", err)
        setError("Failed to load form data.")
        setLoading(false)
      }
    }
    fetchData()
  }, [data, reset])

  const [state, formAction] = useFormState(
    type === "create" ? createCity : updateCity,
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
      toast(`City ${type === "create" ? "created" : "updated"} successfully!`)
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new city" : "Edit City"}</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">City Name</label>
          <Input
            type="text"
            {...register("name")}
            className="w-full"
            placeholder="Enter city name"
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">State</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("state")}
          >
            <option value="">Select State</option>
            {statesOptions.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-xs text-red-400">{errors.state.message}</p>}
        </div>

        <div className="flex flex-col gap-2 w-full">
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
          {errors.country && <p className="text-xs text-red-400">{errors.country.message}</p>}
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

export default CityForm
