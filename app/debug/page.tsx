"use client"

import { useEffect, useState } from "react"

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [apiTests, setApiTests] = useState<any[]>([])

  useEffect(() => {
    // Get all environment variables
    const vars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }
    setEnvVars(vars)

    // Test different API URLs
    const testUrls = [
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
      "https://employee-directory-backend.vercel.app/api/v1",
      "https://employee-directory-backend-cl19l0044-aneeq-ahmads-projects.vercel.app/api/v1",
    ]

    const runTests = async () => {
      const results = []
      
      for (const url of testUrls) {
        try {
          console.log(`Testing URL: ${url}/employees/test`)
          
          const startTime = Date.now()
          const response = await fetch(`${url}/employees/test`, {
            method: 'GET',
            mode: 'cors',
          })
          const endTime = Date.now()
          
          if (response.ok) {
            const data = await response.json()
            results.push({
              url,
              status: 'success',
              statusCode: response.status,
              responseTime: endTime - startTime,
              data,
              headers: Object.fromEntries(response.headers.entries())
            })
          } else {
            results.push({
              url,
              status: 'error',
              statusCode: response.status,
              responseTime: endTime - startTime,
              error: `HTTP ${response.status}`,
              headers: Object.fromEntries(response.headers.entries())
            })
          }
        } catch (error) {
          results.push({
            url,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            responseTime: 0
          })
        }
      }
      
      setApiTests(results)
    }

    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        
        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm">{JSON.stringify(envVars, null, 2)}</pre>
          </div>
        </div>

        {/* API Tests */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API URL Tests</h2>
          {apiTests.map((test, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">{test.url}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong> {test.status}
                </div>
                <div>
                  <strong>Response Time:</strong> {test.responseTime}ms
                </div>
                {test.statusCode && (
                  <div>
                    <strong>Status Code:</strong> {test.statusCode}
                  </div>
                )}
                {test.error && (
                  <div className="col-span-2">
                    <strong>Error:</strong> <span className="text-red-600">{test.error}</span>
                  </div>
                )}
                {test.data && (
                  <div className="col-span-2">
                    <strong>Response:</strong>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(test.data, null, 2)}</pre>
                  </div>
                )}
                {test.headers && (
                  <div className="col-span-2">
                    <strong>Response Headers:</strong>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(test.headers, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Browser Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User Agent:</strong> {navigator.userAgent}
            </div>
            <div>
              <strong>Platform:</strong> {navigator.platform}
            </div>
            <div>
              <strong>Language:</strong> {navigator.language}
            </div>
            <div>
              <strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {/* Manual Test Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test Links</h2>
          <div className="space-y-2">
            {apiTests.map((test, index) => (
              <div key={index}>
                <a 
                  href={`${test.url}/employees/test`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Test {test.url}/employees/test
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 