import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { signOut } from "next-auth/react"
import SignOutButton from "@/components/SignOutButton"

async function getVolunteerData(userId: string) {
  const signUps = await prisma.signUp.findMany({
    where: { volunteerId: userId },
    include: {
      opportunity: {
        include: { organization: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { signUps }
}

export default async function VolunteerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.VOLUNTEER) {
    redirect("/auth/signin")
  }

  const { signUps } = await getVolunteerData(session.user.id)
  const upcomingSignUps = signUps.filter(
    (s) => new Date(s.opportunity.startDate) > new Date()
  )
  const pastSignUps = signUps.filter(
    (s) => new Date(s.opportunity.startDate) <= new Date()
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
            <span className="text-gray-700">Welcome, {session.user.name}!</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Volunteer Dashboard</h1>
          <p className="text-gray-600">View and manage your volunteer commitments</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <Link
            href="/opportunities"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Browse New Opportunities
          </Link>
        </div>

        {/* Upcoming Sign-ups */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Opportunities</h2>
          {upcomingSignUps.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">You don't have any upcoming volunteer commitments.</p>
              <Link href="/opportunities" className="text-blue-600 hover:underline mt-2 inline-block">
                Browse opportunities →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSignUps.map((signUp) => (
                <div key={signUp.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{signUp.opportunity.title}</h3>
                      <p className="text-gray-600 mb-2">{signUp.opportunity.organization.name}</p>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>📍 {signUp.opportunity.location}</p>
                        <p>📅 {new Date(signUp.opportunity.startDate).toLocaleString()}</p>
                        <p>⏰ Until {new Date(signUp.opportunity.endDate).toLocaleString()}</p>
                      </div>
                      {signUp.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700"><strong>Notes:</strong> {signUp.notes}</p>
                        </div>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {signUp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Sign-ups */}
        {pastSignUps.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Opportunities</h2>
            <div className="space-y-4">
              {pastSignUps.map((signUp) => (
                <div key={signUp.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{signUp.opportunity.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{signUp.opportunity.organization.name}</p>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(signUp.opportunity.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      Completed
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
