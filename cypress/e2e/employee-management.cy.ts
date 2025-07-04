import { describe, beforeEach, it } from "cypress"
import { cy } from "cypress"

describe("Employee Management", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.intercept("GET", "/api/v1/employees*", { fixture: "employees.json" }).as("getEmployees")
  })

  it("should display employee list", () => {
    cy.wait("@getEmployees")
    cy.get('[data-testid="employee-card"]').should("have.length.greaterThan", 0)
  })

  it("should search employees", () => {
    cy.wait("@getEmployees")
    cy.get('[data-testid="search-input"]').type("John")
    cy.get('[data-testid="employee-card"]').should("contain", "John")
  })

  it("should filter by department", () => {
    cy.wait("@getEmployees")
    cy.get('[data-testid="department-filter"]').click()
    cy.get('[data-value="Engineering"]').click()
    cy.get('[data-testid="employee-card"]').should("contain", "Engineering")
  })

  it("should open add employee modal", () => {
    cy.get('[data-testid="add-employee-btn"]').click()
    cy.get('[data-testid="add-employee-modal"]').should("be.visible")
  })

  it("should create new employee", () => {
    cy.intercept("POST", "/api/v1/employees", { fixture: "new-employee.json" }).as("createEmployee")

    cy.get('[data-testid="add-employee-btn"]').click()
    cy.get('[data-testid="first-name-input"]').type("Jane")
    cy.get('[data-testid="last-name-input"]').type("Smith")
    cy.get('[data-testid="email-input"]').type("jane.smith@example.com")
    cy.get('[data-testid="phone-input"]').type("+1987654321")
    cy.get('[data-testid="title-input"]').type("Product Manager")
    cy.get('[data-testid="department-select"]').click()
    cy.get('[data-value="Product"]').click()
    cy.get('[data-testid="location-select"]').click()
    cy.get('[data-value="San Francisco"]').click()
    cy.get('[data-testid="hire-date-input"]').type("2024-01-15")
    cy.get('[data-testid="salary-input"]').type("85000")

    cy.get('[data-testid="submit-btn"]').click()
    cy.wait("@createEmployee")
    cy.get('[data-testid="success-modal"]').should("be.visible")
  })
})
