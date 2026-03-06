import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, userId, anonymous, questions } = body

    if (!name || !userId) {
      return NextResponse.json(
        { error: "name e userId são obrigatórios" },
        { status: 400 }
      )
    }

    const form = await prisma.form.create({
      data: {
        name,
        userId,
        anonymous: anonymous ?? true,
        questions: {
          create: questions?.map((q: any, index: number) => ({
            pergunta: q.pergunta,
            type: q.type,
            required: q.required ?? false,
            order: q.order ?? index
          }))
        }
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(form)
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar formulário" },
      { status: 500 }
    )
  }
}

//nesse get busco o form pelo id do usuario
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId não informado" },
        { status: 400 }
      )
    }

    const forms = await prisma.form.findMany({
      where: {
        userId
      },
      include: {
        questions: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(forms)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: "id é obrigatório" },
        { status: 400 }
      )
    }

    await prisma.question.deleteMany({
      where: {
        formId: id
      }
    })

    await prisma.form.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Formulário removido com sucesso"
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao deletar formulário" },
      { status: 500 }
    )
  }
}