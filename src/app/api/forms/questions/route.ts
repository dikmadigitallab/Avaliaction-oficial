import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get("formId")

    if (!formId) {
      return NextResponse.json({ error: "formId é obrigatório" }, { status: 400 })
    }

    const body = await req.json()
    const { title, type, required, order } = body

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        title,
        type: type ?? "TEXT",
        required: required ?? false,
        order: order ?? 0,
        formId,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar pergunta" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    const body = await req.json()
    const { title, type, required, order } = body

    const question = await prisma.question.update({
      where: { id },
      data: {
        title,
        type,
        required,
        order,
      },
    })

    return NextResponse.json(question)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar pergunta" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    await prisma.question.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Pergunta removida com sucesso" })
  } catch {
    return NextResponse.json({ error: "Erro ao deletar pergunta" }, { status: 500 })
  }
}