"use client"

import React from "react"
import ErrorBoundary from "./ErrorBoundary"

interface ClientErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

/**
 * Client-side wrapper for ErrorBoundary to ensure it only runs on the client
 * This prevents hydration issues and server-side rendering problems
 */
export default function ClientErrorBoundary({ children, fallback }: ClientErrorBoundaryProps) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR or before hydration, render children without error boundary
  if (!isClient) {
    return <>{children}</>
  }

  // After hydration, use the error boundary
  return (
    <ErrorBoundary fallback={fallback} enableLogging={true}>
      {children}
    </ErrorBoundary>
  )
}
