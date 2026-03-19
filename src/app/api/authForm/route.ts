import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"



/* 
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

 */



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
      select: {
        id: true,
        cpf_list: true,
        name:true
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      )
    }

    if (form.cpf_list?.includes(cpf)) {
      return NextResponse.json(
        { error: "Este CPF já respondeu o formulário" },
        { status: 409 }
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




export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cpf, formId } = body

    if (!cpf || !formId) {
      return NextResponse.json(
        { error: "cpf e formId são obrigatórios" },
        { status: 400 }
      )
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { cpf_list: true }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      )
    }

    if (form.cpf_list.includes(cpf)) {
      return NextResponse.json(
        { error: "CPF já respondeu este formulário" },
        { status: 409 }
      )
    }

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: {
        cpf_list: {
          push: cpf
        }
      }
    })

    return NextResponse.json(updatedForm)
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar CPF" },
      { status: 500 }
    )
  }
}
