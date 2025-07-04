"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { AppDispatch } from "@/store/store"
import { updateEmployee } from "@/store/slices/employeeSlice"
import type { Employee, UpdateEmployeeDto } from "@/types/employee"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

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
  hireDate: yup.string().required("Hire date is required"),
  salary: yup.number().positive("Salary must be positive").required("Salary is required"),
})

interface EditEmployeeModalProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (employee: Employee, data: UpdateEmployeeDto) => void // Add success callback
}

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Product"]
const locations = ["New York", "San Francisco", "London", "Toronto", "Berlin", "Tokyo", "Sydney", "Remote"]

export default function EditEmployeeModal({ employee, isOpen, onClose, onSuccess }: EditEmployeeModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateEmployeeDto>({
    resolver: yupResolver(schema),
  })

  const watchedDepartment = watch("department")
  const watchedLocation = watch("location")

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        title: employee.title,
        department: employee.department,
        location: employee.location,
        hireDate: employee.hireDate.split("T")[0], // Format date for input
        salary: employee.salary,
      })
    }
  }, [employee, reset])

  const onSubmit = async (data: UpdateEmployeeDto) => {
    if (!employee) return

    setIsSubmitting(true)
    try {
      await dispatch(updateEmployee({ id: employee.id, data })).unwrap()
      onClose() // Close the edit modal first
      onSuccess(employee, data) // Then trigger success modal
    } catch (error) {
      toast.error("Failed to update employee")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!employee) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
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
              <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
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
              <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
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
            <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
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
            <Input id="phone" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
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
            <Input id="title" {...register("title")} className={errors.title ? "border-red-500" : ""} />
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
              <Select value={watchedDepartment || ""} onValueChange={(value) => setValue("department", value)}>
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
              <Select value={watchedLocation || ""} onValueChange={(value) => setValue("location", value)}>
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
                {...register("hireDate")}
                className={errors.hireDate ? "border-red-500" : ""}
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Updating..." : "Update Employee"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
