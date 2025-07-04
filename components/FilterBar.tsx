"use client"

import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { AppDispatch, RootState } from "@/store/store"
import { setFilters, clearFilters } from "@/store/slices/employeeSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Product"]

const locations = ["New York", "San Francisco", "London", "Toronto", "Berlin", "Tokyo", "Sydney", "Remote"]

export default function FilterBar() {
  const dispatch = useDispatch<AppDispatch>()
  const { filters } = useSelector((state: RootState) => state.employees)

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value === "all" ? "" : value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-4 items-center"
    >
      <div className="flex flex-wrap gap-4 flex-1">
        <div className="min-w-[150px]">
          <Select
            value={filters.department || "all"}
            onValueChange={(value) => handleFilterChange("department", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={filters.location || "all"} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="text-gray-600 hover:text-gray-800 bg-transparent"
        >
          <FilterX className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </motion.div>
  )
}
