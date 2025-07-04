import type { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilters } from "@/types/employee"

// Use proxy URL to bypass CORS
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use proxy URL to bypass CORS
    return process.env.NEXT_PUBLIC_API_URL || "/api/proxy"
  }
  // Server-side: use direct backend URL
  return process.env.NEXT_PUBLIC_API_URL || "https://employee-directory-backend.vercel.app/api/v1"
}

const API_BASE_URL = getApiBaseUrl()

interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new ApiError(response.status, errorData.message || "Request failed")
  }
  return response.json()
}

export const employeeApi = {
  async getEmployees(params: { page: number; limit: number } & EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const searchParams = new URLSearchParams()

    searchParams.append("page", params.page.toString())
    searchParams.append("limit", params.limit.toString())

    if (params.search) searchParams.append("search", params.search)
    if (params.department) searchParams.append("department", params.department)
    if (params.location) searchParams.append("location", params.location)

    console.log('Making API request to:', `${API_BASE_URL}/employees?${searchParams}`)
    
    const response = await fetch(`${API_BASE_URL}/employees?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  },

  async getEmployee(id: string): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  },

  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async deleteEmployee(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new ApiError(response.status, errorData.message || "Delete failed")
    }
  },
}
