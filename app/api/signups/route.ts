import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, OpportunityStatus } from "@prisma/client"
import { sendSignUpConfirmation, sendSignUpNotificationToOrg } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== UserRole.VOLUNTEER) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { opportunityId } = await request.json()

    if (!opportunityId) {
      return NextResponse.json(
        { error: "Opportunity ID is required" },
        { status: 400 }
      )
    }

    // Get the opportunity with organization details
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: { organization: true }
    })

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      )
    }

    // Check if opportunity is open
    if (opportunity.status !== OpportunityStatus.OPEN) {
      return NextResponse.json(
        { error: "This opportunity is not open for sign-ups" },
        { status: 400 }
      )
    }

    // Check if already full
    if (opportunity.filledSlots >= opportunity.totalSlots) {
      return NextResponse.json(
        { error: "This opportunity is full" },
        { status: 400 }
      )
    }

    // Check if user already signed up
    const existingSignUp = await prisma.signUp.findUnique({
      where: {
        volunteerId_opportunityId: {
          volunteerId: session.user.id,
          opportunityId: opportunityId,
        }
      }
    })

    if (existingSignUp) {
      return NextResponse.json(
        { error: "You have already signed up for this opportunity" },
        { status: 400 }
      )
    }

    // Create the sign-up and update filled slots in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const signUp = await tx.signUp.create({
        data: {
          volunteerId: session.user.id,
          opportunityId: opportunityId,
        },
        include: {
          volunteer: true,
          opportunity: {
            include: { organization: true }
          }
        }
      })

      const updatedOpportunity = await tx.opportunity.update({
        where: { id: opportunityId },
        data: {
          filledSlots: { increment: 1 },
          // Automatically mark as FULL if this was the last slot
          status: opportunity.filledSlots + 1 >= opportunity.totalSlots 
            ? OpportunityStatus.FULL 
            : opportunity.status
        }
      })

      return { signUp, updatedOpportunity }
    })

    // Send confirmation emails
    try {
      await sendSignUpConfirmation(
        session.user.email,
        session.user.name || "Volunteer",
        opportunity.title,
        opportunity.organization.name,
        opportunity.startDate
      )

      await sendSignUpNotificationToOrg(
        opportunity.organization.email,
        session.user.name || "A volunteer",
        opportunity.title
      )
    } catch (emailError) {
      console.error("Failed to send emails:", emailError)
      // Don't fail the request if emails fail
    }

    return NextResponse.json({
      message: "Successfully signed up!",
      signUp: result.signUp
    })
  } catch (error) {
    console.error("Sign-up error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
