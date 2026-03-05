import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { formId, respostas } = body

    console.log("BODY RECEBIDO:", body)
    console.log("RESPOSTAS:", respostas)

    if (!formId || !respostas) {
      return NextResponse.json(
        { error: "formId ou respostas ausentes" },
        { status: 400 }
      )
    }

    await prisma.resposta.create({
      data: {
        formId,
        respostas
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao salvar respostas" },
      { status: 500 }
    )
  }
}


//buscar respostas pelo id do form
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get("formId")

    if (!formId) {
      return NextResponse.json(
        { error: "formId não informado" },
        { status: 400 }
      )
    }

    const respostas = await prisma.resposta.findMany({
      where: {
        formId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(respostas)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar respostas" },
      { status: 500 }
    )
  }
}