"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchEmployees } from "@/store/slices/employeeSlice"
import EmployeeList from "@/components/EmployeeList"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"
import AddEmployeeModal from "@/components/AddEmployeeModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { employees, loading, filters, pagination } = useSelector((state: RootState) => state.employees)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters,
      }),
    )
  }, [dispatch, filters, pagination.currentPage, pagination.limit])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employee Directory</h1>
          <p className="text-gray-600">Manage and search through your organization's employees</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex-1 w-full lg:w-auto">
              <SearchBar />
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>

          <FilterBar />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <EmployeeList employees={employees} loading={loading} />
        </motion.div>

        <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </div>
  )
}
