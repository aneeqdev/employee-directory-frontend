import { sanitizeInput, validateEmail, validatePhone } from "@/lib/security"

describe("Security Utils", () => {
  describe("sanitizeInput", () => {
    it("should remove script tags", () => {
      const malicious = '<script>alert("xss")</script>Hello'
      expect(sanitizeInput(malicious)).toBe("Hello")
    })

    it("should remove dangerous attributes", () => {
      const malicious = '<div onclick="alert()">Hello</div>'
      expect(sanitizeInput(malicious)).toBe("<div>Hello</div>")
    })

    it("should preserve safe HTML", () => {
      const safe = "<p>Hello <strong>World</strong></p>"
      expect(sanitizeInput(safe)).toBe(safe)
    })
  })

  describe("validateEmail", () => {
    it("should validate correct emails", () => {
      expect(validateEmail("test@example.com")).toBe(true)
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true)
    })

    it("should reject invalid emails", () => {
      expect(validateEmail("invalid-email")).toBe(false)
      expect(validateEmail("@domain.com")).toBe(false)
      expect(validateEmail("test@")).toBe(false)
    })
  })

  describe("validatePhone", () => {
    it("should validate correct phone numbers", () => {
      expect(validatePhone("+1234567890")).toBe(true)
      expect(validatePhone("1234567890")).toBe(true)
    })

    it("should reject invalid phone numbers", () => {
      expect(validatePhone("123")).toBe(false)
      expect(validatePhone("abc123")).toBe(false)
    })
  })
})
