import { NextResponse } from "next/server"

type User = {
    role: string
    id: string
    nome: string
    email: string
    cpf: string
    senha: string
}

const mockUser: User = {
  role: "admin",
  id: "1",
  nome: "Douglas",
  email: "douglas@ex.com",
  cpf: "123.123.123-12",
  senha: "123"
}

export async function GET() {
  return NextResponse.json({
    user: mockUser,
  })
}

export async function POST() {
  const res = NextResponse.json({
    user: mockUser,
  })

  res.cookies.set("mock-session", "true", {
    httpOnly: true,
    path: "/",
  })

  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })

  res.cookies.set("mock-session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  })

  return res
}