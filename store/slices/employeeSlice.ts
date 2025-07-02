import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilters } from "@/types/employee"
import { employeeApi } from "@/services/api"

interface EmployeeState {
  employees: Employee[]
  loading: boolean
  error: string | null
  filters: EmployeeFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    limit: number
  }
}

const initialState: EmployeeState = {
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
    limit: 9,
  },
}

// Async thunks
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (params: { page: number; limit: number } & EmployeeFilters) => {
    const response = await employeeApi.getEmployees(params)
    return response
  },
)

export const createEmployee = createAsyncThunk("employees/createEmployee", async (employeeData: CreateEmployeeDto) => {
  const response = await employeeApi.createEmployee(employeeData)
  return response
})

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, data }: { id: string; data: UpdateEmployeeDto }) => {
    const response = await employeeApi.updateEmployee(id, data)
    return response
  },
)

export const deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id: string) => {
  await employeeApi.deleteEmployee(id)
  return id
})

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.pagination.currentPage = 1
    },
    setFilters: (state, action: PayloadAction<EmployeeFilters>) => {
      state.filters = action.payload
      state.pagination.currentPage = 1
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        department: "",
        location: "",
      }
      state.pagination.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload.data
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          limit: action.payload.limit,
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch employees"
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false
        state.employees.unshift(action.payload)
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create employee"
      })
      // Update employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((emp) => emp.id === action.payload.id)
        if (index !== -1) {
          state.employees[index] = action.payload
        }
      })
      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((emp) => emp.id !== action.payload)
      })
  },
})

export const { setSearchTerm, setFilters, clearFilters, setCurrentPage } = employeeSlice.actions
export default employeeSlice.reducer
