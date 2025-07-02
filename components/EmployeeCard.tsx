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

export default function EmployeeCard({ employee, children }: EmployeeCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-start space-x-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={`${employee.firstName} ${employee.lastName}`} />
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
          <span>Joined {formatDate(employee.hireDate)}</span>
        </div>
      </div>

      {children}
    </div>
  )
}
