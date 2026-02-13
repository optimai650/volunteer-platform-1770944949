import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { OpportunityStatus, OrganizationStatus } from "@prisma/client"

async function getAllOpportunities() {
  return await prisma.opportunity.findMany({
    where: {
      status: OpportunityStatus.OPEN,
      organization: {
        status: OrganizationStatus.APPROVED
      },
      startDate: {
        gte: new Date()
      }
    },
    include: {
      organization: true,
    },
    orderBy: {
      startDate: 'asc'
    }
  })
}

export default async function OpportunitiesPage() {
  const opportunities = await getAllOpportunities()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Volunteer Platform
          </Link>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Volunteer Opportunities</h1>

        {opportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No opportunities available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
                <p className="text-gray-600 mb-2 text-sm font-medium">{opportunity.organization.name}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p>📍 {opportunity.location}</p>
                  <p>📅 {new Date(opportunity.startDate).toLocaleDateString()} at {new Date(opportunity.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>👥 {opportunity.totalSlots - opportunity.filledSlots} of {opportunity.totalSlots} spots available</p>
                </div>
                <Link
                  href={`/opportunities/${opportunity.id}`}
                  className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  View & Sign Up
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
