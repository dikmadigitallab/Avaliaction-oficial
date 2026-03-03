import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cpf = searchParams.get("cpf")
    const formId = searchParams.get("formId")

    if (!cpf || !formId) {
      return NextResponse.json(
        { error: "cpf e formId são obrigatórios" },
        { status: 400 }
      )
    }

    if (cpf === "98765432100") {
      return NextResponse.json(
        { error: "Cpf não autorizado" },
        { status: 403 }
      )
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
    })

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      )
    }

    const link = `/responder/${formId}/${cpf}`

    return NextResponse.json({ link })
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar link" },
      { status: 500 }
    )
  }
}