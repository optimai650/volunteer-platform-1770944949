import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, OrganizationStatus } from "@prisma/client"
import Link from "next/link"
import SignOutButton from "@/components/SignOutButton"
import CreateOpportunityButton from "@/components/CreateOpportunityButton"

async function getOrgAdminData(userId: string) {
  const organization = await prisma.organization.findUnique({
    where: { adminId: userId },
    include: {
      opportunities: {
        include: {
          signUps: {
            include: { volunteer: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  return { organization }
}

export default async function OrgAdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== UserRole.ORG_ADMIN) {
    redirect("/auth/signin")
  }

  const { organization } = await getOrgAdminData(session.user.id)

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Volunteer Platform
            </Link>
            <SignOutButton />
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">No Organization Found</h1>
            <p className="text-gray-600">Your organization account hasn't been set up yet. Please contact the administrator.</p>
          </div>
        </div>
      </div>
    )
  }

  const isApproved = organization.status === OrganizationStatus.APPROVED
  const upcomingOpportunities = organization.opportunities.filter(
    (opp) => new Date(opp.startDate) > new Date()
  )
  const pastOpportunities = organization.opportunities.filter(
    (opp) => new Date(opp.startDate) <= new Date()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Volunteer Platform
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{organization.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
          <p className="text-gray-600">Manage your volunteer opportunities</p>
        </div>

        {/* Organization Status */}
        <div className={`rounded-lg p-6 mb-8 ${
          isApproved ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Organization Status</h2>
              <p className={isApproved ? 'text-green-800' : 'text-yellow-800'}>
                {isApproved 
                  ? '✓ Approved - You can create opportunities' 
                  : '⏳ Pending Approval - You cannot create opportunities yet'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full font-medium ${
              isApproved ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
            }`}>
              {organization.status}
            </span>
          </div>
        </div>

        {/* Organization Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Organization Information</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{organization.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{organization.email}</p>
            </div>
            {organization.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{organization.phone}</p>
              </div>
            )}
            {organization.website && (
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a href={organization.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                  {organization.website}
                </a>
              </div>
            )}
          </div>
          {organization.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{organization.description}</p>
            </div>
          )}
        </div>

        {/* Create Opportunity Button */}
        {isApproved && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Opportunity</h2>
            <CreateOpportunityButton organizationId={organization.id} />
          </div>
        )}

        {/* Opportunities */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Opportunities</h2>
          {organization.opportunities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">You haven't created any opportunities yet.</p>
              {isApproved && <p className="text-gray-500 mt-2">Click the button above to create your first opportunity!</p>}
            </div>
          ) : (
            <>
              {upcomingOpportunities.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-bold text-gray-700">Upcoming</h3>
                  {upcomingOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>📍 {opportunity.location}</p>
                            <p>📅 {new Date(opportunity.startDate).toLocaleString()}</p>
                            <p>👥 {opportunity.filledSlots} / {opportunity.totalSlots} volunteers signed up</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          opportunity.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          opportunity.status === 'FULL' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {opportunity.status}
                        </span>
                      </div>
                      
                      {opportunity.signUps.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-bold mb-2">Volunteers:</h4>
                          <div className="space-y-2">
                            {opportunity.signUps.map((signUp) => (
                              <div key={signUp.id} className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{signUp.volunteer.name}</span>
                                <span className="text-gray-500">({signUp.volunteer.email})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {pastOpportunities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Past</h3>
                  {pastOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{opportunity.title}</h3>
                          <p className="text-sm text-gray-600">
                            📅 {new Date(opportunity.startDate).toLocaleDateString()} • 
                            👥 {opportunity.filledSlots} volunteers
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
