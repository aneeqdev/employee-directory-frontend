"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageInfo?: boolean
}

export default function Pagination({ currentPage, totalPages, onPageChange, showPageInfo = true }: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 1 // Show 1 page on each side of current page
    const range = []
    const rangeWithDots = []

    // Always show first page
    rangeWithDots.push(1)

    // Calculate range around current page
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    // Add dots if there's a gap after first page
    if (start > 2) {
      rangeWithDots.push("...")
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i)
    }

    // Add dots if there's a gap before last page
    if (end < totalPages - 1) {
      rangeWithDots.push("...")
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center space-y-4"
    >
      {/* Page Navigation */}
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex items-center"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex space-x-1">
          {visiblePages.map((page, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-500 text-sm">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[40px] ${
                    currentPage === page ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-50"
                  }`}
                  title={`Go to page ${page}`}
                >
                  {page}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center"
          title="Next page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex items-center"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Page Info */}
      {showPageInfo && (
        <div className="text-xs text-gray-500 text-center">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </motion.div>
  )
}
