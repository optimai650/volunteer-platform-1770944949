"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpButton({ opportunityId }: { opportunityId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to sign up")
      } else {
        router.push("/dashboard?signup=success")
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleSignUp}
        disabled={loading}
        className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-medium text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing up..." : "Sign Up for This Opportunity"}
      </button>
    </div>
  )
}
