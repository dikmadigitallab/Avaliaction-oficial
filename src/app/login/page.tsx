"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Home } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { formatCPF } from "@/lib/anonymize"
import Image from "next/image"

export default function AdminLoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [cpf, setCpf] = useState("123.987.456-60")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value))
  }

  const handleGoHome = () => {
    router.push("/")
  }


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log("submit start")

  const cleanedCpf = cpf.replace(/\D/g, "")
  const success = login(cleanedCpf, password)

  console.log("login result:", success)

  if (success) {
    router.push("/admin/dashboard")
  } else {
    setError("Credenciais inválidas")
  }

  console.log("submit end")
}

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div
        className="mb-6 flex flex-col items-center gap-3 cursor-pointer"
        onClick={handleGoHome}
      >
        <Image
          src="https://i.ibb.co/Z61BpdnN/download.png"
          alt="Dikma"
          width={120}
          height={40}
          priority
        />
        <p className="text-xs text-muted-foreground sm:text-sm">
          Painel Administrativo
        </p>
      </div>

      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Acesso Administrativo</CardTitle>
          <CardDescription>
            Informe seu CPF e senha para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              
              inputMode="numeric"
              value={'123.987.456-60'} //cpf
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className="text-center text-lg tracking-wider"
              autoComplete="off"
            />

            <Input
              type="password"
              value={password} //password
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="off"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <Button type="submit" className="gap-2">
              Entrar no Painel
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button
        variant="ghost"
        onClick={handleGoHome}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground hover:bg-transparent gap-2"
      >
        <Home className="h-4 w-4" />
        Voltar ao início
      </Button>
    </div>
  )
}