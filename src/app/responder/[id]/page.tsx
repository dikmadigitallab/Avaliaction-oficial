"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { FeaturesSection } from "@/components/features-section"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function HomePage() {
  const router = useRouter()
  const params = useParams()
  const formId = params?.id as string

  const [cpf, setCpf] = useState("")
  const [loading, setLoading] = useState(false)
  const [titulo, setTitulo] = useState<string>('meu titulo')

  useEffect(() => {
    const buscarNome = async () => {
      try {
        const res = await fetch(`/api/authForm/searchTitle?formId=${formId}`);
        const data = await res.json();
  
        if (res.ok) {
          setTitulo(data.name);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    buscarNome();
  }, [formId]);

  // Função para limitar a 11 números
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove o que não é número
    if (value.length <= 11) {
      setCpf(value);
    }
  }

  // Função para o Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  }

  const handleSubmit = async () => {
    if (cpf.length !== 11) {
      toast.error("O CPF deve ter exatamente 11 dígitos.")
      return
    }

    if (!formId) {
      toast.error("Formulario invalido.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(
        `/api/authForm?cpf=${encodeURIComponent(cpf)}&formId=${encodeURIComponent(formId)}`
      )
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Nao autorizado.")
        return
      }

      await fetch("/api/authForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, formId }),
      })

      router.push(data.link)
    } catch {
      toast.error("Erro ao validar CPF.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      <section className="flex flex-col items-center gap-4 px-4 pt-12 pb-10 text-center sm:pt-16 sm:pb-12">
        <div className="flex items-center gap-2 h-10 sm:h-12">
          <Image
            src="https://i.ibb.co/Z61BpdnN/download.png"
            alt="Dikma"
            width={120}
            height={40}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </div>

        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {titulo}
        </h1>

        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          Contribua com sua avaliacao para fortalecer a empresa. Sua resposta e anonima.
        </p>
      </section>

      <section className="flex justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-4">
          <Input
            placeholder="Digite seu CPF (11 dígitos)"
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={handleCpfChange}
            onKeyDown={handleKeyDown} // Ativa o Enter
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Validando..." : "Responder formulario"}
          </Button>
        </div>
      </section>

      <FeaturesSection />

      <footer className="mt-auto border-t py-6 text-center text-xs text-muted-foreground">
        <p>Dikma - Plataforma de avaliacao anonima</p>
      </footer>
    </div>
  )
}