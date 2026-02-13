"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OrganizationApprovalButtons({ organizationId }: { organizationId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApproval = async (approved: boolean) => {
    if (!confirm(`Are you sure you want to ${approved ? 'approve' : 'reject'} this organization?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/organizations/${organizationId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to update organization status")
      }
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleApproval(true)}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ✓ Approve
      </button>
      <button
        onClick={() => handleApproval(false)}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ✗ Reject
      </button>
    </div>
  )
}
