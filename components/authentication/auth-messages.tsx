"use client"

import { useSearchParams } from "next/navigation"

export function AuthMessages() {
  const searchParams = useSearchParams()

  const error = searchParams.get("error")
  const message = searchParams.get("message")

  return (
    <>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-100 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-red-800">
              An error has occurred
            </h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      {message && (
        <div className="rounded-md border border-green-200 bg-green-100 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-800">Éxito</h3>
            <p className="text-sm text-green-700">{message}</p>
          </div>
        </div>
      )}
    </>
  )
}
