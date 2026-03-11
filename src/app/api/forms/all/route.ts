import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        questions: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    )
  }
}