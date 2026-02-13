import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, OrganizationStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      name,
      description,
      email,
      phone,
      address,
      website,
      adminEmail,
      adminName,
      adminPassword,
    } = await request.json()

    // Validate required fields
    if (!name || !email || !adminEmail || !adminName || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this admin email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Create admin user and organization in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create admin user
      const admin = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: UserRole.ORG_ADMIN,
          emailVerified: new Date(), // Auto-verify admin accounts
        }
      })

      // Create organization
      const organization = await tx.organization.create({
        data: {
          name,
          description: description || null,
          email,
          phone: phone || null,
          address: address || null,
          website: website || null,
          status: OrganizationStatus.PENDING,
          adminId: admin.id,
        }
      })

      return { admin, organization }
    })

    return NextResponse.json({
      message: "Organization and admin account created successfully",
      organization: result.organization
    })
  } catch (error) {
    console.error("Create organization error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
