"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, ArrowRight } from "lucide-react"
import { validateCPF, formatCPF, hashCPF } from "@/lib/anonymize"
import { maskCPF, setAdminSession } from "@/lib/store"
import { createAccessLog } from "@/lib/api"
import { toast } from "sonner"

export function CpfEntrySection() {
  const [cpf, setCpf] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = cpf.replace(/\D/g, "") // Remove tudo que não é número

    if (cleaned.length !== 11) {
      toast.error("CPF inválido. Insira 11 dígitos.")
      return
    }

    // --- VERIFICAÇÃO DINÂMICA DE ADMIN ---
    // 1. Pegamos os admins que você criou na página de administração
    const adminsSalvos = localStorage.getItem("admins")
    const listaAdmins = adminsSalvos ? JSON.parse(adminsSalvos) : []
    
    // 2. CPF Mestre padrão
    const CPF_MESTRE = "12345678909"

    // 3. Procuramos se o CPF digitado bate com algum admin criado
    const adminEncontrado = listaAdmins.find((a: any) => a.cpf.replace(/\D/g, "") === cleaned)
    const eAdminMestre = cleaned === CPF_MESTRE

    if (eAdminMestre || adminEncontrado) {
      setLoading(true)
      try {
        // Define os dados da sessão baseados no que você salvou na administração
        const dadosParaSessao = eAdminMestre 
          ? { nome: "Administrador Mestre", permissions: { dashboard: true, podeCriarAdmin: true } }
          : adminEncontrado

        // Salva quem está logado para o Sidebar usar as permissões
        localStorage.setItem("usuarioLogado", JSON.stringify(dadosParaSessao))
        
        // Ativa a proteção de rota do v0
        setAdminSession()

        toast.success(`Bem-vindo, ${dadosParaSessao.nome}!`)
        router.push("/admin/dashboard")
        return 
      } catch (error) {
        toast.error("Erro ao acessar área administrativa.")
      } finally {
        setLoading(false)
      }
    }
    // --- FIM DA VERIFICAÇÃO DE ADMIN ---

    // Lógica para usuários comuns (avaliação)
    if (!validateCPF(cleaned)) {
      toast.error("CPF inválido para avaliação.")
      return
    }

    setLoading(true)
    try {
      const anonymousId = await hashCPF(cleaned)
      sessionStorage.setItem("anonymous_id", anonymousId)
      router.push("/evaluate")
    } catch {
      toast.error("Erro ao processar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 pb-16">
      <Card className="border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Acessar Sistema</CardTitle>
          <CardDescription>Insira seu CPF para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
              className="text-center text-lg"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verificando..." : "Entrar"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}