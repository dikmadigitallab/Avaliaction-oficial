import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const id = searchParams.get("id")
    const email = searchParams.get("email")
    const cpf = searchParams.get("cpf")

    if (!id && !email && !cpf) {
      return NextResponse.json(
        { error: "Informe id, email ou cpf" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          id ? { id } : undefined,
          email ? { email } : undefined,
          cpf ? { cpf } : undefined,
        ].filter(Boolean) as any,
      },
      include: {
        cpfs: true,
        formularios: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 }
    )
  }
}