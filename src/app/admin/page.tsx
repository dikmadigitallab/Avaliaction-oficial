"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function AdminLogoutPage() {

  const router = useRouter()



  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold">
          Deseja sair do painel?
        </h1>

        <div className="flex flex-col gap-4">
        

          <Button variant="outline">
            Sair e voltar para login
          </Button>
        </div>
      </div>
    </div>
  )
}