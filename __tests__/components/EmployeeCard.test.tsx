import type React from "react"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import EmployeeCard from "@/components/EmployeeCard"
import employeeReducer from "@/store/slices/employeeSlice"
import type { Employee } from "@/types/employee"

const mockEmployee: Employee = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  title: "Software Engineer",
  department: "Engineering",
  location: "New York",
  hireDate: "2023-01-15",
  salary: 75000,
  createdAt: "2023-01-15T00:00:00Z",
  updatedAt: "2023-01-15T00:00:00Z",
}

const mockStore = configureStore({
  reducer: {
    employees: employeeReducer,
  },
})

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>)
}

describe("EmployeeCard", () => {
  it("renders employee information correctly", () => {
    renderWithProvider(<EmployeeCard employee={mockEmployee} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Software Engineer")).toBeInTheDocument()
    expect(screen.getByText("Engineering")).toBeInTheDocument()
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument()
    expect(screen.getByText("+1234567890")).toBeInTheDocument()
    expect(screen.getByText("New York")).toBeInTheDocument()
  })

  it("displays formatted hire date", () => {
    renderWithProvider(<EmployeeCard employee={mockEmployee} />)

    expect(screen.getByText(/Joined Jan 15, 2023/)).toBeInTheDocument()
  })

  it("shows employee initials when no avatar", () => {
    renderWithProvider(<EmployeeCard employee={mockEmployee} />)

    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders children when provided", () => {
    renderWithProvider(
      <EmployeeCard employee={mockEmployee}>
        <button>Test Button</button>
      </EmployeeCard>,
    )

    expect(screen.getByRole("button", { name: "Test Button" })).toBeInTheDocument()
  })
})
