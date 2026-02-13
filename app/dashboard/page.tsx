import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  // Route to appropriate dashboard based on role
  switch (session.user.role) {
    case UserRole.SUPER_ADMIN:
      redirect("/dashboard/super-admin")
    case UserRole.ORG_ADMIN:
      redirect("/dashboard/org-admin")
    case UserRole.VOLUNTEER:
      redirect("/dashboard/volunteer")
    default:
      redirect("/auth/signin")
  }
}
