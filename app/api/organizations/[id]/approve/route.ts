import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, OrganizationStatus } from "@prisma/client"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { approved } = await request.json()

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        status: approved ? OrganizationStatus.APPROVED : OrganizationStatus.REJECTED
      }
    })

    return NextResponse.json({
      message: `Organization ${approved ? 'approved' : 'rejected'} successfully`,
      organization
    })
  } catch (error) {
    console.error("Approval error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
