import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function proxy(req: NextRequest) {
  const session = await getServerSession(authOptions)


  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  if (session.user.userType !== "GERENTE" && session.user.userType !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  // Se passou na validação, deixa seguir
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"] // protege todas as rotas /admin
}