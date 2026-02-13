import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { OpportunityStatus, OrganizationStatus } from "@prisma/client"

async function getOpportunities() {
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
    },
    take: 6
  })
}

export default async function HomePage() {
  const opportunities = await getOpportunities()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Volunteer Platform</h1>
          <div className="flex gap-4">
            <Link
              href="/opportunities"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
            >
              Browse Opportunities
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Make a Difference in Your Community
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Connect with local organizations and volunteer opportunities
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/opportunities"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium text-lg hover:bg-blue-50"
            >
              Find Opportunities
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-medium text-lg hover:bg-blue-800"
            >
              Register as Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Opportunities */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8">Upcoming Opportunities</h3>
        
        {opportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No opportunities available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-bold mb-2">{opportunity.title}</h4>
                <p className="text-gray-600 mb-2 text-sm">{opportunity.organization.name}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>
                <div className="text-sm text-gray-600 mb-4">
                  <p>📍 {opportunity.location}</p>
                  <p>📅 {new Date(opportunity.startDate).toLocaleDateString()}</p>
                  <p>👥 {opportunity.totalSlots - opportunity.filledSlots} spots left</p>
                </div>
                <Link
                  href={`/opportunities/${opportunity.id}`}
                  className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {opportunities.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/opportunities"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
            >
              View All Opportunities →
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2026 Volunteer Platform. Making communities better together.</p>
        </div>
      </footer>
    </div>
  )
}
