// @/components/columns/usersColumns.js
"use client"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import UsersForm from "@/components/settingsForms/UsersForm"
import { deleteUser } from "@/actions/userActions"
import { toast } from "react-toastify"


export const columns = [
  {
    accessorKey: "login_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Login ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "emailid",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <span>
        {row.original.roles.map((role) => role.role_name).join(", ") || "No Roles"}
      </span>
    ),
  },
  {
    accessorKey: "departments",
    header: "Departments",
    cell: ({ row }) => (
      <span>
        {row.original.departments.map((dept) => dept.department_name).join(", ") || "No Departments"}
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
        Status
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

      // Function to open the UsersForm for editing
      const onEdit = () => {
        setFormType("edit")
        setFormData(row.original)
        setIsFormOpen(true)
      }

      // Function to close the UsersForm
      const closeForm = () => {
        setIsFormOpen(false)
        setFormData(null)
      }

      // Function to open delete confirmation popup
      const onDelete = () => {
        setIsDeleteConfirmOpen(true)
      }

      // Function to delete the user
      const confirmDelete = async () => {
        try {
          await deleteUser(row.original._id)
          toast.success("User deleted successfully!")
          setIsDeleteConfirmOpen(false)
          router.refresh()
        } catch (error) {
          toast.error("Failed to delete user. Please try again.")
        }
      }

      // Function to close delete confirmation popup
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

          {/* Render UsersForm as a popup or modal */}
          {isFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md max-w-2xl mx-auto">
                <UsersForm
                  type={formType}
                  data={formData}
                  setOpen={closeForm}
                />
              </div>
            </div>
          )}

          {/* Render Delete Confirmation Popup */}
          {isDeleteConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md max-w-sm mx-auto">
                <h3 className="text-lg font-medium">Delete Confirmation</h3>
                <p className="mt-2 text-sm">Are you sure you want to delete this record?</p>
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

// CreateNewUserButton component
export const CreateNewUserButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState("create")
  const [formData, setFormData] = useState(null)

  const router = useRouter();


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
      <Button className="bg-blue-500 text-white" onClick={() => router.push("/settings/user/new")}>
        Create New User
      </Button>
      </div>

      {/* Render UsersForm as a popup or modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-2xl mx-auto">
            <UsersForm
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
