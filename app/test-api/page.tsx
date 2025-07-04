"use client"

import { useEffect, useState } from "react"

export default function TestApiPage() {
  const [status, setStatus] = useState<string>("Loading...")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [corsTestStatus, setCorsTestStatus] = useState<string>("Not tested")
  const [corsTestData, setCorsTestData] = useState<any>(null)
  const [corsTestError, setCorsTestError] = useState<string>("")

  useEffect(() => {
    const testApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        console.log("Testing API URL:", apiUrl)
        
        const response = await fetch(`${apiUrl}/employees?page=1&limit=5`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        setStatus("Success")
      } catch (err) {
        console.error("API Test Error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setStatus("Failed")
      }
    }

    const testCors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        console.log("Testing CORS with URL:", `${apiUrl}/employees/test`)
        
        const response = await fetch(`${apiUrl}/employees/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setCorsTestData(result)
        setCorsTestStatus("Success")
      } catch (err) {
        console.error("CORS Test Error:", err)
        setCorsTestError(err instanceof Error ? err.message : "Unknown error")
        setCorsTestStatus("Failed")
      }
    }

    testApi()
    testCors()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        {/* Main API Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Main API Test: {status}</h2>
          
          <div className="mb-4">
            <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {data && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <strong>Response:</strong>
              <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* CORS Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">CORS Test: {corsTestStatus}</h2>
          
          {corsTestError && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <strong>CORS Error:</strong> {corsTestError}
            </div>
          )}
          
          {corsTestData && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <strong>CORS Response:</strong>
              <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(corsTestData, null, 2)}</pre>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold mb-2">Environment Variables:</h3>
          <ul className="text-sm space-y-1">
            <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</li>
            <li><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "Not set"}</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
          <h3 className="font-semibold mb-2">Debugging Tips:</h3>
          <ul className="text-sm space-y-1">
            <li>• Check browser console for CORS errors</li>
            <li>• Verify environment variables are set in Vercel</li>
            <li>• Test the backend directly: <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/employees/test`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Test Endpoint</a></li>
            <li>• Check Vercel function logs for backend errors</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 