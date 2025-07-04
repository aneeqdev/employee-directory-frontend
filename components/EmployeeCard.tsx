"use client"

import type React from "react"
import type { Employee } from "@/types/employee"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, Calendar } from "lucide-react"

interface EmployeeCardProps {
  employee: Employee
  children?: React.ReactNode
}

/**
 * EmployeeCard component displays employee information in a card format
 * @param employee - Employee data to display
 * @param children - Optional child components (typically action buttons)
 */
export default function EmployeeCard({ employee, children }: EmployeeCardProps) {
  /**
   * Generates initials from first and last name
   * @param firstName - Employee's first name
   * @param lastName - Employee's last name
   * @returns Uppercase initials string
   */
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  /**
   * Formats date string and determines appropriate label
   * @param dateString - ISO date string
   * @returns Object with formatted date and appropriate label
   */
  const formatDateWithLabel = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isInFuture = date > today

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    return {
      date: formattedDate,
      label: isInFuture ? "Starts" : "Joined",
    }
  }

  const { date: hireDate, label: hireDateLabel } = formatDateWithLabel(employee.hireDate)

  return (
    <div className="p-6">
      <div className="flex items-start space-x-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={employee.avatar || "/placeholder.svg?height=48&width=48"}
            alt={`${employee.firstName} ${employee.lastName}`}
          />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
            {getInitials(employee.firstName, employee.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-gray-600 truncate">{employee.title}</p>
          <Badge variant="secondary" className="mt-1">
            {employee.department}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{employee.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            {hireDateLabel} {hireDate}
          </span>
        </div>
      </div>

      {children}
    </div>
  )
}
