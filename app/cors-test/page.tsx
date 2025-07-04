"use client"

import { useEffect, useState } from "react"

export default function CorsTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    const runTests = async () => {
      const results = []
      const apiUrl = "https://employee-directory-backend.vercel.app/api/v1"
      
      // Test 1: Simple GET request
      try {
        console.log("Test 1: Simple GET request")
        const response = await fetch(`${apiUrl}/employees/cors-test`)
        if (response.ok) {
          const data = await response.json()
          results.push({
            test: "Simple GET",
            status: "✅ Success",
            data
          })
        } else {
          results.push({
            test: "Simple GET",
            status: "❌ Failed",
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        results.push({
          test: "Simple GET",
          status: "❌ Failed",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }

      // Test 2: GET with headers
      try {
        console.log("Test 2: GET with headers")
        const response = await fetch(`${apiUrl}/employees/cors-test`, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (response.ok) {
          const data = await response.json()
          results.push({
            test: "GET with headers",
            status: "✅ Success",
            data
          })
        } else {
          results.push({
            test: "GET with headers",
            status: "❌ Failed",
            error: `HTTP ${response.status}`
          })
        }
      } catch (error) {
        results.push({
          test: "GET with headers",
          status: "❌ Failed",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }

      // Test 3: OPTIONS request
      try {
        console.log("Test 3: OPTIONS request")
        const response = await fetch(`${apiUrl}/employees/cors-test`, {
          method: 'OPTIONS'
        })
        results.push({
          test: "OPTIONS preflight",
          status: response.status === 204 ? "✅ Success" : "❌ Failed",
          statusCode: response.status,
          headers: Object.fromEntries(response.headers.entries())
        })
      } catch (error) {
        results.push({
          test: "OPTIONS preflight",
          status: "❌ Failed",
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
        
        <div className="bg-white rounded-lg shadow p-6">
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
                {result.statusCode && (
                  <div className="mb-2">
                    <strong>Status Code:</strong> {result.statusCode}
                  </div>
                )}
                {result.data && (
                  <div className="mb-2">
                    <strong>Response:</strong>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
                {result.headers && (
                  <div>
                    <strong>Response Headers:</strong>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(result.headers, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
          <h3 className="font-semibold mb-2">Direct API Links:</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://employee-directory-backend.vercel.app/api/v1/employees/cors-test" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                CORS Test Endpoint
              </a>
            </li>
            <li>
              <a 
                href="https://employee-directory-backend.vercel.app/api/v1/employees?page=1&limit=5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Employees List
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 