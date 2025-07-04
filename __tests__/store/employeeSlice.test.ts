import employeeReducer, {
  setSearchTerm,
  setFilters,
  clearFilters,
  setCurrentPage,
  fetchEmployees,
} from "@/store/slices/employeeSlice"
import type { EmployeeFilters } from "@/types/employee"

const initialState = {
  employees: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    department: "",
    location: "",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },
}

describe("employeeSlice", () => {
  it("should return the initial state", () => {
    expect(employeeReducer(undefined, { type: "unknown" })).toEqual(initialState)
  })

  it("should handle setSearchTerm", () => {
    const actual = employeeReducer(initialState, setSearchTerm("john"))
    expect(actual.filters.search).toEqual("john")
    expect(actual.pagination.currentPage).toEqual(1)
  })

  it("should handle setFilters", () => {
    const filters: EmployeeFilters = {
      search: "test",
      department: "Engineering",
      location: "New York",
    }
    const actual = employeeReducer(initialState, setFilters(filters))
    expect(actual.filters).toEqual(filters)
    expect(actual.pagination.currentPage).toEqual(1)
  })

  it("should handle clearFilters", () => {
    const stateWithFilters = {
      ...initialState,
      filters: {
        search: "test",
        department: "Engineering",
        location: "New York",
      },
      pagination: {
        ...initialState.pagination,
        currentPage: 3,
      },
    }
    const actual = employeeReducer(stateWithFilters, clearFilters())
    expect(actual.filters).toEqual(initialState.filters)
    expect(actual.pagination.currentPage).toEqual(1)
  })

  it("should handle setCurrentPage", () => {
    const actual = employeeReducer(initialState, setCurrentPage(5))
    expect(actual.pagination.currentPage).toEqual(5)
  })

  it("should handle fetchEmployees.pending", () => {
    const action = { type: fetchEmployees.pending.type }
    const state = employeeReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBe(null)
  })
})
