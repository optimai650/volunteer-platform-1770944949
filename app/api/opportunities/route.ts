import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, OrganizationStatus } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== UserRole.ORG_ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      location,
      startDate,
      endDate,
      totalSlots,
      requirements,
      organizationId,
    } = await request.json()

    // Verify the organization exists and is approved
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    if (organization.adminId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    if (organization.status !== OrganizationStatus.APPROVED) {
      return NextResponse.json(
        { error: "Organization must be approved before creating opportunities" },
        { status: 403 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      )
    }

    if (start < new Date()) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      )
    }

    // Create the opportunity
    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        description,
        location,
        startDate: start,
        endDate: end,
        totalSlots,
        requirements: requirements || null,
        organizationId,
      }
    })

    return NextResponse.json({
      message: "Opportunity created successfully",
      opportunity
    })
  } catch (error) {
    console.error("Create opportunity error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
