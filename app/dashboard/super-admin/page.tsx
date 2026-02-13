import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, OrganizationStatus } from "@prisma/client"
import Link from "next/link"
import SignOutButton from "@/components/SignOutButton"
import CreateOrganizationButton from "@/components/CreateOrganizationButton"
import OrganizationApprovalButtons from "@/components/OrganizationApprovalButtons"

async function getSuperAdminData() {
  const organizations = await prisma.organization.findMany({
    include: {
      admin: true,
      opportunities: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalVolunteers = await prisma.user.count({
    where: { role: UserRole.VOLUNTEER }
  })

  const totalOpportunities = await prisma.opportunity.count()

  const totalSignUps = await prisma.signUp.count()

  return {
    organizations,
    totalVolunteers,
    totalOpportunities,
    totalSignUps,
  }
}

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
    redirect("/auth/signin")
  }

  const { organizations, totalVolunteers, totalOpportunities, totalSignUps } = await getSuperAdminData()

  const pendingOrgs = organizations.filter(org => org.status === OrganizationStatus.PENDING)
  const approvedOrgs = organizations.filter(org => org.status === OrganizationStatus.APPROVED)
  const rejectedOrgs = organizations.filter(org => org.status === OrganizationStatus.REJECTED)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Volunteer Platform
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Super Admin</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage organizations and monitor platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Organizations</h3>
            <p className="text-3xl font-bold text-blue-600">{organizations.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Volunteers</h3>
            <p className="text-3xl font-bold text-green-600">{totalVolunteers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Opportunities</h3>
            <p className="text-3xl font-bold text-purple-600">{totalOpportunities}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Sign-ups</h3>
            <p className="text-3xl font-bold text-orange-600">{totalSignUps}</p>
          </div>
        </div>

        {/* Create Organization */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Organization</h2>
          <CreateOrganizationButton />
        </div>

        {/* Pending Approvals */}
        {pendingOrgs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-600">
              Pending Approvals ({pendingOrgs.length})
            </h2>
            <div className="space-y-4">
              {pendingOrgs.map((org) => (
                <div key={org.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{org.name}</h3>
                      <div className="text-sm text-gray-700 space-y-1 mb-4">
                        <p><strong>Admin:</strong> {org.admin.name} ({org.admin.email})</p>
                        <p><strong>Email:</strong> {org.email}</p>
                        {org.phone && <p><strong>Phone:</strong> {org.phone}</p>}
                        {org.website && <p><strong>Website:</strong> <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{org.website}</a></p>}
                        {org.description && <p><strong>Description:</strong> {org.description}</p>}
                      </div>
                      <OrganizationApprovalButtons organizationId={org.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Organizations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Approved Organizations ({approvedOrgs.length})
          </h2>
          {approvedOrgs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
              No approved organizations yet.
            </div>
          ) : (
            <div className="space-y-4">
              {approvedOrgs.map((org) => (
                <div key={org.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{org.name}</h3>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><strong>Admin:</strong> {org.admin.name} ({org.admin.email})</p>
                        <p><strong>Email:</strong> {org.email}</p>
                        <p><strong>Opportunities:</strong> {org.opportunities.length}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rejected Organizations */}
        {rejectedOrgs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Rejected Organizations ({rejectedOrgs.length})
            </h2>
            <div className="space-y-4">
              {rejectedOrgs.map((org) => (
                <div key={org.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{org.name}</h3>
                      <p className="text-sm text-gray-600">{org.admin.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Rejected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
