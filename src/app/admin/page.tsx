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
import { Shield, ArrowRight, Home } from "lucide-react" // Adicionei o ícone Home
import { setAdminSession, addAccessLog, maskCPF } from "@/lib/store"
import { formatCPF } from "@/lib/anonymize"
import { toast } from "sonner"
import Image from "next/image"

export default function AdminLoginPage() {
  const [cpf, setCpf] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  // FUNÇÃO PARA VOLTAR AO INÍCIO
  const handleGoHome = () => {
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = cpf.replace(/\D/g, "")

    if (cleaned.length !== 11) {
      toast.error("Insira um CPF válido com 11 dígitos.")
      return
    }

    setLoading(true)
    try {
      const adminsSalvos = localStorage.getItem("admins")
      const listaAdmins = adminsSalvos ? JSON.parse(adminsSalvos) : []
      const adminEncontrado = listaAdmins.find((a: any) => a.cpf === cleaned)
      const isMestre = cleaned === "00000000000" 

      if (adminEncontrado || isMestre) {
        const usuarioParaSessao = isMestre 
          ? { nome: "Administrador Mestre", permissions: { dashboard: true, administracao: true } }
          : adminEncontrado

        addAccessLog({
          anonymousId: "admin",
          maskedCPF: maskCPF(cleaned),
          action: "admin_login",
        })

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioParaSessao))
        setAdminSession(usuarioParaSessao.nome)

        toast.success(`Bem-vindo, ${usuarioParaSessao.nome}!`)
        router.push("/admin/dashboard")
      } else {
        toast.error("CPF não autorizado para acesso administrativo.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao verificar CPF.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Clique na logo também volta ao início */}
      <div className="mb-6 flex flex-col items-center gap-3 animate-fade-in-up sm:mb-8 cursor-pointer" onClick={handleGoHome}>
          <Image
            src="https://i.ibb.co/Z61BpdnN/download.png"
            alt="Dikma"
            width={120}
            height={40}
            className="h-10 w-auto sm:h-12"
            priority
            unoptimized
          />
        <p className="text-xs text-muted-foreground sm:text-sm">Painel Administrativo</p>
      </div>

      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-card-foreground">Acesso Administrativo</CardTitle>
          <CardDescription>
            Insira seu CPF cadastrado para acessar o painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className="text-center text-lg tracking-wider"
              autoComplete="off"
            />
            <Button type="submit" disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {loading ? "Verificando..." : "Entrar no Painel"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Botão de voltar transformado em Button Ghost para garantir o clique */}
      <Button 
        variant="ghost" 
        onClick={handleGoHome}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors gap-2"
      >
        <Home className="h-4 w-4" />
        Voltar ao início
      </Button>
    </div>
  )
}