import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=Invalid token`)
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=Invalid token`)
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token }
      })
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=Token expired`)
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token }
    })

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?verified=true`)
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=Something went wrong`)
  }
}
