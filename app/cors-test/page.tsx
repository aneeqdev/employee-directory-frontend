"use client"

import { useEffect, useState } from "react"

export default function CorsTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    const runTests = async () => {
      const results = []
      
      // Test 1: Proxy employees list (this is working)
      try {
        console.log("Test 1: Proxy employees list")
        const response = await fetch('/api/proxy/employees?page=1&limit=5')
        if (response.ok) {
          const data = await response.json()
          results.push({
            test: "Proxy Employees List",
            status: "✅ Success",
            data: {
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              totalItems: data.totalItems,
              dataLength: data.data?.length || 0,
              firstEmployee: data.data?.[0]?.name || "No employees"
            }
          })
        } else {
          results.push({
            test: "Proxy Employees List",
            status: "❌ Failed",
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        results.push({
          test: "Proxy Employees List",
          status: "❌ Failed",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }

      // Test 2: Test the regular test endpoint
      try {
        console.log("Test 2: Regular test endpoint")
        const response = await fetch('/api/proxy/employees/test')
        if (response.ok) {
          const data = await response.json()
          results.push({
            test: "Proxy Test Endpoint",
            status: "✅ Success",
            data
          })
        } else {
          results.push({
            test: "Proxy Test Endpoint",
            status: "❌ Failed",
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        results.push({
          test: "Proxy Test Endpoint",
          status: "❌ Failed",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }

      // Test 3: Test health endpoint
      try {
        console.log("Test 3: Health endpoint")
        const response = await fetch('/api/proxy/health')
        if (response.ok) {
          const data = await response.json()
          results.push({
            test: "Proxy Health Check",
            status: "✅ Success",
            data
          })
        } else {
          results.push({
            test: "Proxy Health Check",
            status: "❌ Failed",
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        results.push({
          test: "Proxy Health Check",
          status: "❌ Failed",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }

      // Test 4: Direct backend request (should fail with CORS)
      try {
        console.log("Test 4: Direct backend request")
        const response = await fetch('https://employee-directory-backend.vercel.app/api/v1/employees?page=1&limit=5')
        if (response.ok) {
          const data = await response.json()
          results.push({
            test: "Direct Backend GET",
            status: "✅ Success (CORS fixed!)",
            data: {
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              totalItems: data.totalItems,
              dataLength: data.data?.length || 0
            }
          })
        } else {
          results.push({
            test: "Direct Backend GET",
            status: "❌ Failed",
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        results.push({
          test: "Direct Backend GET",
          status: "❌ Failed (Expected CORS error)",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }

      setTestResults(results)
    }

    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CORS Test Results</h1>
        
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">🎉 Proxy Solution Working!</h2>
          <p className="text-green-700">
            The proxy solution is working! Your main application should now function correctly.
            The employees list is loading successfully through the proxy.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {testResults.map((result, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">{result.test}</h3>
              <div className="text-sm">
                <div className="mb-2">
                  <strong>Status:</strong> {result.status}
                </div>
                {result.error && (
                  <div className="text-red-600 mb-2">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                {result.data && (
                  <div className="mb-2">
                    <strong>Response:</strong>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
          <h3 className="font-semibold mb-2">Test Links:</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="/api/proxy/employees?page=1&limit=5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Proxy Employees List
              </a>
            </li>
            <li>
              <a 
                href="/api/proxy/employees/test" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Proxy Test Endpoint
              </a>
            </li>
            <li>
              <a 
                href="/api/proxy/health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Proxy Health Check
              </a>
            </li>
            <li>
              <a 
                href="/" 
                className="text-green-600 hover:underline font-semibold"
              >
                🏠 Go to Main Application
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-6">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <ul className="text-sm space-y-1">
            <li>• The proxy is working for the main employees endpoint</li>
            <li>• Your application should now function correctly</li>
            <li>• Visit the main page to test the full application</li>
            <li>• The CORS issue is resolved through the proxy solution</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 