import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function requestAcess(allowedRoles: string[] = ["GERENTE", "ADMIN"]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/") // redireciona se não estiver logado
  }

  if (!allowedRoles.includes(session.user.userType)) {
    redirect("/admin/dashboard") // redireciona se não tiver permissão
  }

  return session
}