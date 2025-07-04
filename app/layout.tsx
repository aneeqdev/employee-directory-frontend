import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "sonner"
import ErrorBoundary from "@/components/ErrorBoundary"

// Optimize font loading with display swap and preload
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Employee Directory",
  description: "Modern employee directory application built with Next.js and NestJS",
  generator: "v0.dev",
  // Add performance optimizations
  other: {
    "format-detection": "telephone=no",
  },
}

/**
 * Root Layout Component
 *
 * Provides the base HTML structure and global providers for the entire application.
 * Includes error boundaries, toast notifications, and security headers.
 *
 * Features:
 * - Global error boundary for unhandled errors
 * - Redux store provider for state management
 * - Toast notification system
 * - Optimized font loading with display swap
 * - Performance optimizations
 *
 * @param children - Child components to render
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Add security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary enableLogging={true}>
          <Providers>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
              toastOptions={{
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
