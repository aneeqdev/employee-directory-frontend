export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  department: string
  location: string
  hireDate: string
  salary: number
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  department: string
  location: string
  hireDate: string
  salary: number
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {}

export interface EmployeeFilters {
  search: string
  department: string
  location: string
}
