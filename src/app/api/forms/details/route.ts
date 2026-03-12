import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"



//esse get busca pelo id do form, para mostrar os detalhes do form e responder


/* 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "id não informado" },
        { status: 400 }
      )
    }

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: "asc"
          }
        }

      }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar formulário" },
      { status: 500 }
    )
  }
}

 */






export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "id não informado" },
        { status: 400 }
      )
    }

    const form = await prisma.form.findUnique({
      where: {
        id
      },
      include: {
        questions: {
          orderBy: {
            order: "asc"
          },
          select: {
            id: true,
            pergunta: true,
            type: true,
            required: true,
            order: true,
            itens: true
          }
        },
        respostas: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(form)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar formulário" },
      { status: 500 }
    )
  }
}