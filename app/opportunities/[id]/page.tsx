import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import SignUpButton from "@/components/SignUpButton"

async function getOpportunity(id: string) {
  return await prisma.opportunity.findUnique({
    where: { id },
    include: {
      organization: true,
      signUps: {
        include: {
          volunteer: true
        }
      }
    }
  })
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const opportunity = await getOpportunity(params.id)
  const session = await getServerSession(authOptions)

  if (!opportunity) {
    notFound()
  }

  const isVolunteer = session?.user?.role === UserRole.VOLUNTEER
  const alreadySignedUp = session && opportunity.signUps.some(
    (signup) => signup.volunteerId === session.user.id
  )
  const isFull = opportunity.filledSlots >= opportunity.totalSlots
  const canSignUp = isVolunteer && !alreadySignedUp && !isFull

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Volunteer Platform
          </Link>
          <div className="flex gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/opportunities"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to all opportunities
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">{opportunity.title}</h1>
          
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <span className="font-medium">{opportunity.organization.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Details</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">📍 Location:</span> {opportunity.location}</p>
                <p><span className="font-medium">📅 Start:</span> {new Date(opportunity.startDate).toLocaleString()}</p>
                <p><span className="font-medium">⏰ End:</span> {new Date(opportunity.endDate).toLocaleString()}</p>
                <p><span className="font-medium">👥 Availability:</span> {opportunity.totalSlots - opportunity.filledSlots} of {opportunity.totalSlots} spots</p>
              </div>
            </div>

            {opportunity.requirements && (
              <div>
                <h3 className="font-bold text-lg mb-3">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.requirements}</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{opportunity.description}</p>
          </div>

          {!session && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-700 mb-4">Sign in to register for this opportunity</p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {session && !isVolunteer && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-gray-700">Only volunteers can sign up for opportunities.</p>
            </div>
          )}

          {alreadySignedUp && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">✓ You're already signed up for this opportunity!</p>
              <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
                View in Dashboard →
              </Link>
            </div>
          )}

          {isFull && !alreadySignedUp && isVolunteer && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">This opportunity is currently full.</p>
            </div>
          )}

          {canSignUp && (
            <SignUpButton opportunityId={opportunity.id} />
          )}
        </div>
      </div>
    </div>
  )
}
