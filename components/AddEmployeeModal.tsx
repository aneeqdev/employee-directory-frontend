"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { AppDispatch, RootState } from "@/store/store"
import { createEmployee, fetchEmployees } from "@/store/slices/employeeSlice"
import type { CreateEmployeeDto } from "@/types/employee"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Validation schema with future date prevention
const schema = yup.object({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number (e.g., +1234567890 or 1234567890)")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  title: yup.string().required("Title is required"),
  department: yup.string().required("Department is required"),
  location: yup.string().required("Location is required"),
  hireDate: yup
    .string()
    .required("Hire date is required")
    .test("not-future", "Hire date cannot be in the future", (value) => {
      if (!value) return false
      const selectedDate = new Date(value)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // Set to end of today
      return selectedDate <= today
    }),
  salary: yup.number().positive("Salary must be positive").required("Salary is required"),
})

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: CreateEmployeeDto) => void
}

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Product"]
const locations = ["New York", "San Francisco", "London", "Toronto", "Berlin", "Tokyo", "Sydney", "Remote"]

/**
 * AddEmployeeModal component for creating new employees
 * Includes form validation and prevents future hire dates
 */
export default function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { pagination, filters } = useSelector((state: RootState) => state.employees)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateEmployeeDto>({
    resolver: yupResolver(schema),
  })

  const watchedDepartment = watch("department")
  const watchedLocation = watch("location")

  /**
   * Handles form submission with duplicate prevention
   * @param data - Form data to submit
   */
  const onSubmit = async (data: CreateEmployeeDto) => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)
    try {
      await dispatch(createEmployee(data)).unwrap()
      dispatch(
        fetchEmployees({
          page: pagination.currentPage,
          limit: pagination.limit,
          ...filters,
        }),
      )
      reset()
      onClose()
      onSuccess(data)
    } catch (error) {
      toast.error("Failed to add employee")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles modal close with form reset
   */
  const handleClose = () => {
    if (isSubmitting) return // Prevent closing during submission
    reset()
    onClose()
  }

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.firstName.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.lastName.message}
                </motion.p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.title.message}
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={watchedDepartment || ""}
                onValueChange={(value) => setValue("department", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.department.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={watchedLocation || ""}
                onValueChange={(value) => setValue("location", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.location.message}
                </motion.p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input
                id="hireDate"
                type="date"
                max={today}
                {...register("hireDate")}
                className={errors.hireDate ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.hireDate && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.hireDate.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                {...register("salary")}
                className={errors.salary ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.salary && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.salary.message}
                </motion.p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
