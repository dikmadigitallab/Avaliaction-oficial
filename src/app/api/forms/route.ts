import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form não encontrado" }, { status: 404 })
    }

    return NextResponse.json(form)
  }

  const forms = await prisma.form.findMany({
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(forms)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, anonymous } = body

    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    const form = await prisma.form.create({
      data: {
        name,
        anonymous: anonymous ?? true,
      },
    })

    return NextResponse.json(form, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar form" }, { status: 500 })
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
    const { name, anonymous } = body

    const form = await prisma.form.update({
      where: { id },
      data: {
        name,
        anonymous,
      },
    })

    return NextResponse.json(form)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar form" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    await prisma.form.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Form removido com sucesso" })
  } catch {
    return NextResponse.json({ error: "Erro ao deletar form" }, { status: 500 })
  }
}

