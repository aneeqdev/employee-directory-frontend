"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import type { AppDispatch } from "@/store/store"
import { setSearchTerm } from "@/store/slices/employeeSlice"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const dispatch = useDispatch<AppDispatch>()
  const [localSearch, setLocalSearch] = useState("")

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(setSearchTerm(localSearch))
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [localSearch, dispatch])

  const clearSearch = () => {
    setLocalSearch("")
    dispatch(setSearchTerm(""))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search employees by name, email, or title..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 pr-10 w-full"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
