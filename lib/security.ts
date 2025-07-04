import DOMPurify from "isomorphic-dompurify"

/**
 * Security utilities for input validation and sanitization
 * Provides comprehensive protection against common web vulnerabilities
 */

/**
 * Sanitizes HTML input to prevent XSS attacks
 * Uses DOMPurify to remove malicious scripts and attributes
 *
 * @param input - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * \`\`\`typescript
 * const userInput = '<script>alert("xss")</script><p>Hello</p>'
 * const safe = sanitizeInput(userInput) // Returns: '<p>Hello</p>'
 * \`\`\`
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") {
    return ""
  }

  // Only run DOMPurify on the client side
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ol", "ul", "li"],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    })
  }

  // Server-side fallback - basic HTML escaping
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * Validates email addresses using RFC 5322 compliant regex
 *
 * @param email - Email address to validate
 * @returns True if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

/**
 * Validates phone numbers (international format)
 * Accepts formats: +1234567890, 1234567890
 *
 * @param phone - Phone number to validate
 * @returns True if phone number is valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{9,14}$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""))
}

/**
 * Validates URLs to prevent malicious redirects
 *
 * @param url - URL to validate
 * @returns True if URL is valid and safe, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return ["http:", "https:"].includes(urlObj.protocol)
  } catch {
    return false
  }
}

/**
 * Escapes special characters in strings to prevent injection attacks
 * Works on both client and server side
 *
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeHtml = (str: string): string => {
  if (typeof window !== "undefined") {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }

  // Server-side fallback
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * Rate limiting utility for API calls
 * Implements token bucket algorithm
 */
export class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly capacity: number
  private readonly refillRate: number

  /**
   * Creates a new rate limiter
   *
   * @param capacity - Maximum number of tokens
   * @param refillRate - Tokens added per second
   */
  constructor(capacity = 10, refillRate = 1) {
    this.capacity = capacity
    this.refillRate = refillRate
    this.tokens = capacity
    this.lastRefill = Date.now()
  }

  /**
   * Attempts to consume a token
   *
   * @returns True if token was consumed, false if rate limited
   */
  consume(): boolean {
    this.refill()

    if (this.tokens > 0) {
      this.tokens--
      return true
    }

    return false
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000
    const tokensToAdd = Math.floor(timePassed * this.refillRate)

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
      this.lastRefill = now
    }
  }
}

/**
 * Content Security Policy headers for enhanced security
 * Only used on server side
 */
export const getCSPHeaders = () => {
  if (typeof window !== "undefined") {
    return {}
  }

  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  }
}

/**
 * Validates and sanitizes form data
 *
 * @param data - Form data object
 * @param schema - Validation schema
 * @returns Sanitized and validated data
 */
export const validateFormData = <T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, (value: any) => boolean>,
): { isValid: boolean; sanitizedData: T; errors: string[] } => {
  const errors: string[] = []
  const sanitizedData = {} as T

  for (const [key, value] of Object.entries(data)) {
    const validator = schema[key as keyof T]

    try {
      if (typeof value === "string") {
        sanitizedData[key as keyof T] = sanitizeInput(value) as T[keyof T]
      } else {
        sanitizedData[key as keyof T] = value
      }

      if (validator && !validator(sanitizedData[key as keyof T])) {
        errors.push(`Invalid ${key}`)
      }
    } catch (error: any) {
      errors.push(`Error validating ${key}: ${error.message}`)
    }
  }

  return {
    isValid: errors.length === 0,
    sanitizedData,
    errors,
  }
}
