"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type AuthContextType = {
  cpf: string | null
  isAdmin: boolean
  login: (cpf: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cpf, setCpf] = useState<string | null>(null)

  const ADMIN_CPF = "12398745660"   // 11 dígitos
  const ADMIN_PASSWORD = "123456"

  const login = (cpfInput: string, password: string) => {
    if (cpfInput === ADMIN_CPF && password === ADMIN_PASSWORD) {
      setCpf(cpfInput)
      return true
    }
    return false
  }

  const logout = () => {
    setCpf(null)
  }

  return (
    <AuthContext.Provider
      value={{
        cpf,
        isAdmin: cpf === ADMIN_CPF,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}