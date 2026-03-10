import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          user.senha
        )

        if (!senhaValida) {
          return null
        }

        return {
          id: user.id,
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
          userType: user.userType
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.nome = user.nome
        token.email = user.email
        token.cpf = user.cpf
        token.userType = user.userType
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.nome = token.nome as string
      session.user.email = token.email as string
      session.user.cpf = token.cpf as string
      session.user.userType = token.userType as string

      return session
    }
  }
})

export { handler as GET, handler as POST }