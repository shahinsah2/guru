// @/components/columns/taxListColumns.js

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
import TaxListForm from "@/components/settingsForms/TaxListForm"
import { deleteTaxList } from "@/actions/taxListActions"
import { toast } from "react-toastify"

export const columns = [
  {
    accessorKey: "tax_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tax Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "percentage_cgst",
    header: "CGST %",
  },
  {
    accessorKey: "percentage_sgst",
    header: "SGST %",
  },
  {
    accessorKey: "active_status",
    header: "Status",
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

      const onDelete = async () => {
        try {
          await deleteTaxList(row.original._id)
          toast.success("Tax deleted successfully!")
          router.refresh()
        } catch (error) {
          toast.error("Failed to delete tax. Please try again.")
        }
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
                <TaxListForm
                  type={formType}
                  data={formData}
                  setOpen={closeForm}
                />
              </div>
            </div>
          )}
        </>
      )
    },
  },
]

export const CreateNewTaxListButton = () => {
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
          Create New Tax
        </Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-2xl mx-auto">
            <TaxListForm
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
