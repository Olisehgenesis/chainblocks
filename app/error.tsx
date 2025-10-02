"use client"

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-lg w-full bg-white border border-red-200 rounded p-6 shadow">
          <h2 className="text-red-700 font-semibold mb-3">Something went wrong</h2>
          <pre className="text-xs text-red-800 whitespace-pre-wrap mb-4">{error.message}</pre>
          <button
            onClick={() => reset()}
            className="px-3 py-2 bg-red-600 text-white rounded text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}


