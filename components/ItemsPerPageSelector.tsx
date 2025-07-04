"use client"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { setItemsPerPage } from "@/store/slices/employeeSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const itemsPerPageOptions = [
  { value: 9, label: "9 per page" },
  { value: 18, label: "18 per page" },
  { value: 27, label: "27 per page" },
  { value: 36, label: "36 per page" },
]

/**
 * Items Per Page Selector Component
 *
 * Allows users to change how many items are displayed per page.
 * Options are multiples of 9 to maintain the 3-column grid layout.
 */
export default function ItemsPerPageSelector() {
  const dispatch = useDispatch<AppDispatch>()
  const { pagination } = useSelector((state: RootState) => state.employees)

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = Number.parseInt(value, 10)
    dispatch(setItemsPerPage(newLimit))
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="items-per-page" className="text-sm text-gray-600 whitespace-nowrap">
        Show:
      </Label>
      <Select value={pagination.limit.toString()} onValueChange={handleItemsPerPageChange}>
        <SelectTrigger className="w-[130px]" id="items-per-page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {itemsPerPageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
