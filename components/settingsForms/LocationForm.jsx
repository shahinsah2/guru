// @/components/settingsForms/LocationForm.jsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createLocation, updateLocation } from "@/actions/locationActions"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { getCountries } from "@/actions/countryActions"
import { getStates } from "@/actions/stateActions"
import { getCities } from "@/actions/cityActions"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"

const schema = z.object({
  country: z.string().min(1, { message: "Country is required!" }),
  state: z.string().optional(),
  city: z.string().optional(),
  active_status: z.boolean().default(true),
})

const LocationForm = ({ type, data, setOpen }) => {
  const [countriesOptions, setCountriesOptions] = useState([])
  const [statesOptions, setStatesOptions] = useState([])
  const [citiesOptions, setCitiesOptions] = useState([])
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
        const [countries, states, cities] = await Promise.all([
          getCountries(),
          getStates(),
          getCities(),
        ])

        setCountriesOptions(countries)
        setStatesOptions(states)
        setCitiesOptions(cities)

        if (data) {
          const matchedCountry = countries.find((country) => country.name === data.country)
          const matchedState = states.find((state) => state.name === data.state)
          const matchedCity = cities.find((city) => city.name === data.city)

          reset({
            ...data,
            country: matchedCountry ? matchedCountry._id : "",
            state: matchedState ? matchedState._id : "",
            city: matchedCity ? matchedCity._id : "",
          })
        }
      } catch (err) {
        console.error("Failed to fetch countries, states, or cities:", err)
        setError("Failed to load form data.")
        setLoading(false)
      }
    }
    fetchData()
  }, [data, reset])

  const [state, formAction] = useFormState(
    type === "create" ? createLocation : updateLocation,
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
      toast(`Location ${type === "create" ? "created" : "updated"} successfully!`)
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new location" : "Edit Location"}</h1>

      <div className="flex flex-col gap-4">
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
          {errors.country && (
            <p className="text-xs text-red-400">{errors.country.message}</p>
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
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">City</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("city")}
          >
            <option value="">Select City</option>
            {citiesOptions.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
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

export default LocationForm
