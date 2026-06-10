'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-fortress-midnight min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-red-400 font-mono text-sm mb-4 tracking-widest uppercase">
            Error
          </p>
          <h1 className="text-3xl font-bold text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <span className="block mt-2 font-mono text-xs text-slate-600">
                Ref: {error.digest}
              </span>
            )}
          </p>
          <button
            onClick={reset}
            className="bg-fortress-accent hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
