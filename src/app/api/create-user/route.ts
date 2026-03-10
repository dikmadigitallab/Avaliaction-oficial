import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { requestAcess } from "@/hooks/requestAcess"



// GET ALL
export async function GET() {
   const session = await requestAcess()
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(users)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    )
  }
}


// CREATE


export async function POST(req: NextRequest) {
  const session = await requestAcess()
  try {
    const { nome, cpf, email, senha, userType } = await req.json()

    if (!nome || !cpf || !email || !senha) {
      return NextResponse.json(
        { error: "Campos obrigatórios não informados" },
        { status: 400 }
      )
    }

    const tiposValidos = ["EMPRESA", "GERENTE", "SUPERVISOR", "ADMINISTRATOR", "ADMIN"]
    const tipoFinal = tiposValidos.includes(userType) ? userType : "GERENTE"

    // Criptografa a senha antes de salvar
    const hashSenha = await bcrypt.hash(senha, 10)

    const user = await prisma.user.create({
      data: {
        nome,
        cpf,
        email,
        senha: hashSenha, // usa o hash
        userType: tipoFinal
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "CPF ou email já cadastrado" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    )
  }
}



// UPDATE
export async function PUT(req: NextRequest) {
   const session = await requestAcess()
  try {
    const { id, nome, cpf, email, senha, userType } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado" },
        { status: 400 }
      )
    }

    const data: any = {}

    if (nome !== undefined) data.nome = nome
    if (cpf !== undefined) data.cpf = cpf
    if (email !== undefined) data.email = email
    if (senha !== undefined) data.senha = senha
    if (userType !== undefined) data.userType = userType

    const user = await prisma.user.update({
      where: { id },
      data
    })

    return NextResponse.json(user)
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "CPF ou email já cadastrado" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    )
  }
}



// DELETE
export async function DELETE(req: NextRequest) {
   const session = await requestAcess()
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado" },
        { status: 400 }
      )
    }

    const forms = await prisma.form.findMany({
      where: { userId: id },
      select: { id: true }
    })

    const formIds = forms.map(f => f.id)

    await prisma.$transaction([
      prisma.question.deleteMany({
        where: { formId: { in: formIds } }
      }),

      prisma.resposta.deleteMany({
        where: { formId: { in: formIds } }
      }),

      prisma.form.deleteMany({
        where: { id: { in: formIds } }
      }),

      prisma.cpf.deleteMany({
        where: { userId: id }
      }),

      prisma.user.delete({
        where: { id }
      })
    ])

    return NextResponse.json({ message: "Usuário removido com sucesso" })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao remover usuário" },
      { status: 500 }
    )
  }
}
/* testandoapp */

