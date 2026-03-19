import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const formId = searchParams.get("formId")
  
      if (!formId) {
        return NextResponse.json(
          { error: "formId é obrigatório" },
          { status: 400 }
        )
      }
  
      const form = await prisma.form.findUnique({
        where: { id: formId },
        select: {
          id: true,
          name: true
        }
      })
  
      if (!form) {
        return NextResponse.json(
          { error: "Formulário não encontrado" },
          { status: 404 }
        )
      }
  
      return NextResponse.json({ name: form.name })
    } catch {
      return NextResponse.json(
        { error: "Erro ao buscar formulário" },
        { status: 500 }
      )
    }
  }