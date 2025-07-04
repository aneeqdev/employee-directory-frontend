"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import type { AppDispatch, RootState } from "@/store/store"
import { deleteEmployee, setCurrentPage, fetchEmployees } from "@/store/slices/employeeSlice"
import type { Employee, UpdateEmployeeDto } from "@/types/employee"
import EmployeeCard from "./EmployeeCard"
import EditEmployeeModal from "./EditEmployeeModal"
import Pagination from "./Pagination"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import ConfirmationDialog from "./ConfirmationDialog"
import SuccessModal from "./SuccessModal"

interface EmployeeListProps {
  employees: Employee[]
  loading: boolean
  selectedEmployees?: string[]
}

export default function EmployeeList({ employees, loading, selectedEmployees = [] }: EmployeeListProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { pagination, filters } = useSelector((state: RootState) => state.employees)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  // Add state for confirmation dialog
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    employeeId: string
    employeeName: string
  }>({
    isOpen: false,
    employeeId: "",
    employeeName: "",
  })

  // Add state for success modal (moved here from EditEmployeeModal)
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  })

  const handleDelete = (employee: Employee) => {
    setDeleteConfirmation({
      isOpen: true,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
    })
  }

  const confirmDelete = async () => {
    try {
      await dispatch(deleteEmployee(deleteConfirmation.employeeId)).unwrap()
      toast.success("Employee deleted successfully")
      dispatch(
        fetchEmployees({
          page: pagination.currentPage,
          limit: pagination.limit,
          ...filters,
        }),
      )
      setDeleteConfirmation({ isOpen: false, employeeId: "", employeeName: "" })
    } catch (error) {
      toast.error("Failed to delete employee")
    }
  }

  // Handle edit success
  const handleEditSuccess = (employee: Employee, data: UpdateEmployeeDto) => {
    setSuccessModal({
      isOpen: true,
      title: "Employee Updated Successfully!",
      message: `${data.firstName} ${data.lastName}'s information has been updated.`,
    })
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton with 3 items per row */}
        {[...Array(3)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (rowIndex * 3 + colIndex) * 0.1 }}
                className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="text-gray-500 text-lg">No employees found</div>
        <div className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Employee Grid - 3 items per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
              data-testid="employee-card"
            >
              <EmployeeCard employee={employee}>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingEmployee(employee)}
                    className="flex-1"
                    data-testid={`edit-employee-${employee.id}`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(employee)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`delete-employee-${employee.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </EmployeeCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Info and Controls */}
      <div className="flex flex-col items-center space-y-4">
      

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
        <div className="text-sm text-gray-600 text-center">
          {`Showing ${employees.length} of ${pagination.totalItems} employees`}
        </div> 
      </div>

      {/* Edit Modal */}
      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, employeeId: "", employeeName: "" })}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirmation.employeeName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Success Modal - Now independent */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, title: "", message: "" })}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  )
}
