import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"



// GET ALL
export async function GET() {
  try {
    const supervisors = await prisma.supervisor.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(supervisors)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar supervisores" },
      { status: 500 }
    )
  }
}

// CREATE
export async function POST(req: NextRequest) {
  try {
    const { name, cpf, email, password } = await req.json()

    if (!name || !cpf || !email || !password) {
      return NextResponse.json(
        { error: "Campos obrigatórios não informados" },
        { status: 400 }
      )
    }

    const supervisor = await prisma.supervisor.create({
      data: { name, cpf, email, password },
    })

    return NextResponse.json(supervisor, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "CPF ou email já cadastrado" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao criar supervisor" },
      { status: 500 }
    )
  }
}

// UPDATE
export async function PUT(req: NextRequest) {
  try {
    const { id, name, cpf, email, password } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado" },
        { status: 400 }
      )
    }

    const supervisor = await prisma.supervisor.update({
      where: { id },
      data: { name, cpf, email, password },
    })

    return NextResponse.json(supervisor)
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Supervisor não encontrado" },
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
      { error: "Erro ao atualizar supervisor" },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado" },
        { status: 400 }
      )
    }

    await prisma.supervisor.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Supervisor removido com sucesso" })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Supervisor não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao remover supervisor" },
      { status: 500 }
    )
  }
}