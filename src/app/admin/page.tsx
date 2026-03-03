"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function AdminLogoutPage() {
  const { isAdmin, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/")
    }
  }, [isAdmin, router])

  if (!isAdmin) return null

  const handleGoHome = () => {
    logout()
    router.push("/")
  }

  const handleGoLogin = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold">
          Deseja sair do painel?
        </h1>

        <div className="flex flex-col gap-4">
          <Button onClick={handleGoHome}>
            Sair e ir para o início
          </Button>

          <Button variant="outline" onClick={handleGoLogin}>
            Sair e voltar para login
          </Button>
        </div>
      </div>
    </div>
  )
}