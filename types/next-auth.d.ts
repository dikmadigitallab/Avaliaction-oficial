import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      nome: string
      email: string
      cpf: string
      userType: string
    }
  }

  interface User {
    id: string
    nome: string
    email: string
    cpf: string
    userType: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    nome: string
    email: string
    cpf: string
    userType: string
  }
}