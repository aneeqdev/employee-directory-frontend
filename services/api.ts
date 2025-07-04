import type { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilters } from "@/types/employee"

// Force use of proxy URL to bypass CORS
const API_BASE_URL = "/api/proxy"

/**
 * Interface for paginated API responses
 * @template T - The type of data being paginated
 */
interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
}

/**
 * Custom error class for API-related errors
 * Extends the base Error class to include HTTP status codes
 */
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Handles HTTP response processing and error handling
 * @param response - The fetch Response object
 * @returns Promise that resolves to the parsed JSON data
 * @throws ApiError when the response is not ok
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new ApiError(response.status, errorData.message || "Request failed")
  }
  return response.json()
}

/**
 * Employee API service object containing all employee-related API calls
 * Provides methods for CRUD operations on employee data
 */
export const employeeApi = {
  /**
   * Fetches a paginated list of employees with optional filtering
   * @param params - Object containing pagination and filter parameters
   * @param params.page - Current page number (1-based)
   * @param params.limit - Number of items per page
   * @param params.search - Search term for filtering employees
   * @param params.department - Department filter
   * @param params.location - Location filter
   * @returns Promise resolving to paginated employee data
   */
  async getEmployees(params: { page: number; limit: number } & EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    const searchParams = new URLSearchParams()

    // Add pagination parameters
    searchParams.append("page", params.page.toString())
    searchParams.append("limit", params.limit.toString())

    // Add optional filter parameters only if they have values
    if (params.search) searchParams.append("search", params.search)
    if (params.department) searchParams.append("department", params.department)
    if (params.location) searchParams.append("location", params.location)

    const url = `${API_BASE_URL}/employees?${searchParams}`
    console.log('Making API request to:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  },

  /**
   * Fetches a single employee by their ID
   * @param id - The unique identifier of the employee
   * @returns Promise resolving to the employee data
   */
  async getEmployee(id: string): Promise<Employee> {
    const url = `${API_BASE_URL}/employees/${id}`
    console.log('Making API request to:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  },

  /**
   * Creates a new employee record
   * @param data - Employee data for creation (without ID)
   * @returns Promise resolving to the created employee data
   */
  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    const url = `${API_BASE_URL}/employees`
    console.log('Making API request to:', url)
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  /**
   * Updates an existing employee record
   * @param id - The unique identifier of the employee to update
   * @param data - Updated employee data
   * @returns Promise resolving to the updated employee data
   */
  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    const url = `${API_BASE_URL}/employees/${id}`
    console.log('Making API request to:', url)
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  /**
   * Deletes an employee record
   * @param id - The unique identifier of the employee to delete
   * @returns Promise that resolves when deletion is complete
   * @throws ApiError if deletion fails
   */
  async deleteEmployee(id: string): Promise<void> {
    const url = `${API_BASE_URL}/employees/${id}`
    console.log('Making API request to:', url)
    
    const response = await fetch(url, {
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
