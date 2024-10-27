// @/components/columns/locationColumns.js

"use client"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import LocationForm from "@/components/settingsForms/LocationForm"
import { deleteLocation } from "@/actions/locationActions"
import { toast } from "react-toastify"

export const columns = [
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span>
        {row.original.country || "No Country"}
      </span>
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <span>
        {row.original.state || "No State"}
      </span>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <span>
        {row.original.city || "No City"}
      </span>
    ),
  },
  {
    accessorKey: "active_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Active Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.active_status ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isFormOpen, setIsFormOpen] = useState(false)
      const [formType, setFormType] = useState("")
      const [formData, setFormData] = useState(null)
      const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
      const router = useRouter()

      const onEdit = () => {
        setFormType("edit")
        setFormData(row.original)
        setIsFormOpen(true)
      }

      const closeForm = () => {
        setIsFormOpen(false)
        setFormData(null)
      }

      const onDelete = () => {
        setIsDeleteConfirmOpen(true)
      }

      const confirmDelete = async () => {
        try {
          await deleteLocation(row.original._id)
          toast.success("Location deleted successfully!")
          setIsDeleteConfirmOpen(false)
          router.refresh()
        } catch (error) {
          toast.error("Failed to delete location. Please try again.")
        }
      }

      const closeDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false)
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={onEdit}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md max-w-2xl mx-auto">
                <LocationForm
                  type={formType}
                  data={formData}
                  setOpen={closeForm}
                />
              </div>
            </div>
          )}

          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
                <h3 className="text-lg font-medium">Delete Confirmation</h3>
                <p className="mt-2 text-sm">Are you sure you want to delete this location?</p>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={closeDeleteConfirm}>
                    Cancel
                  </Button>
                  <Button className="bg-red-500 text-white" onClick={confirmDelete}>
                    Yes, Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )
    },
  },
]

export const CreateNewLocationButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState("create")
  const [formData, setFormData] = useState(null)

  const openForm = () => {
    setFormType("create")
    setFormData(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setFormData(null)
  }

  return (
    <>
      <div className="flex justify-end mb-1">
        <Button className="bg-blue-500 text-white" onClick={openForm}>
          Create New Location
        </Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-2xl mx-auto">
            <LocationForm
              type={formType}
              data={formData}
              setOpen={closeForm}
            />
          </div>
        </div>
      )}
    </>
  )
}
