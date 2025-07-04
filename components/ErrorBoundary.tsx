"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  enableLogging?: boolean
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

/**
 * Default error fallback component that displays a user-friendly error message
 * with options to retry or report the issue
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && (
            <details className="bg-gray-50 p-3 rounded-md text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">Error Details (Development)</summary>
              <pre className="whitespace-pre-wrap text-red-600 text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Error logging utility that works in client components
 * Only logs in development or when explicitly enabled
 */
const logError = (error: Error, errorInfo: React.ErrorInfo, enableLogging: boolean) => {
  // Only log if explicitly enabled or in development
  if (enableLogging || process.env.NODE_ENV === "development") {
    // Use structured logging for better error tracking
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
    }

    // In production, you would send this to your error monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(error, { extra: errorData })
    } else {
      // Development logging
      console.group("🚨 ErrorBoundary caught an error")
      console.error("Error:", error)
      console.error("Error Info:", errorInfo)
      console.error("Full Error Data:", errorData)
      console.groupEnd()
    }
  }
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * Features:
 * - Catches and handles React component errors
 * - Provides user-friendly error messages
 * - Supports custom error fallback components
 * - Logs errors for monitoring and debugging (configurable)
 * - Allows error recovery without full page reload
 * - Structured error logging for better debugging
 *
 * @example
 * \`\`\`tsx
 * <ErrorBoundary enableLogging={true}>
 *   <MyComponent />
 * </ErrorBoundary>
 * \`\`\`
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error if logging is enabled
    if (this.props.enableLogging !== false) {
      logError(error, errorInfo, this.props.enableLogging || false)
    }

    // Update state with error info
    this.setState({ error, errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

/**
 * Hook for handling async errors in functional components
 *
 * @example
 * \`\`\`tsx
 * const MyComponent = () => {
 *   const throwError = useErrorHandler()
 *
 *   const handleAsyncError = async () => {
 *     try {
 *       await riskyAsyncOperation()
 *     } catch (error) {
 *       throwError(error)
 *     }
 *   }
 * }
 * \`\`\`
 */
export const useErrorHandler = () => {
  const [, setError] = React.useState<Error>()

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}

export default ErrorBoundary
