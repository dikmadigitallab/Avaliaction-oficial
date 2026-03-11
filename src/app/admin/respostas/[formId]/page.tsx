"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Calendar, User, ClipboardList, Loader2, AlertCircle } from "lucide-react"
import { useParams } from "next/navigation"

interface ItemResposta {
  Pergunta?: string
  pergunta?: string
  Resposta?: any
  resposta?: any
}

interface Registro {
  id: string
  createdAt: string
  respostas: ItemResposta[]
}

export default function RespostasPage() {
  const params = useParams()
  const FORM_ID = params?.formId as string

  const [mounted, setMounted] = useState(false)
  const [dados, setDados] = useState<Registro[]>([])
  const [aberto, setAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erroAtivo, setErroAtivo] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const carregarRespostas = useCallback(async () => {
    if (!FORM_ID) return

    setLoading(true)
    setErroAtivo(null)

    try {
      const res = await fetch(`/api/forms/respostas?formId=${FORM_ID}`)
      if (!res.ok) throw new Error("Erro na conexão")

      const json = await res.json()

      const dadosTratados: Registro[] = (Array.isArray(json) ? json : []).map((item: any) => ({
        id: item.id || Math.random().toString(36).slice(2),
        createdAt: item.createdAt || new Date().toISOString(),
        respostas: Array.isArray(item.respostas) ? item.respostas : []
      }))

      setDados(dadosTratados)
    } catch {
      setErroAtivo("Falha ao sincronizar dados com o servidor.")
    } finally {
      setLoading(false)
    }
  }, [FORM_ID])

  useEffect(() => {
    if (mounted) carregarRespostas()
  }, [mounted, carregarRespostas])

  const formatarPergunta = (item: ItemResposta) => item.Pergunta ?? item.pergunta ?? "Sem título"

  const formatarResposta = (item: ItemResposta) => {
    const val = item.Resposta ?? item.resposta
    if (val === null || val === undefined || val === "") return "-"
    if (typeof val === "object") {
      if (Array.isArray(val)) return val.join(", ")
      return val.label || val.value || JSON.stringify(val)
    }
    return String(val)
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
      </div>
    )
  }

  return (
    /* AJUSTE DE COR: bg-white para claro e bg-[#1e293b] para escuro */
<div className="min-h-screen bg-background text-foreground p-6 md:p-10">
  <div className="max-w-4xl mx-auto space-y-10">

    <header className="space-y-2">
      <h1 className="text-3xl font-semibold">Avaliações recebidas</h1>
      <p className="text-sm text-muted-foreground">
        Respostas enviadas para este formulário
      </p>
    </header>

    {erroAtivo && (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
        <AlertCircle size={18} />
        <span className="text-sm">{erroAtivo}</span>
      </div>
    )}

    {dados.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 border rounded-xl text-muted-foreground">
        <ClipboardList size={32} className="mb-3 opacity-40" />
        <p className="text-sm">Nenhuma resposta encontrada</p>
      </div>
    ) : (
      <div className="space-y-5">
        {dados.map((registro, index) => {
          const isOpen = aberto === registro.id

          return (
            <div
              key={registro.id}
              className="border rounded-xl bg-card transition hover:shadow-sm"
            >
              <button
                onClick={() => setAberto(isOpen ? null : registro.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted">
                    <User size={18} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Resposta #{dados.length - index}
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(registro.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t px-5 pb-5 pt-4 space-y-4">
                  {registro.respostas.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-muted/30 p-4 flex flex-col gap-3"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Pergunta
                        </p>

                        <p className="text-sm font-medium">
                          {formatarPergunta(item)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Resposta
                        </p>

                        <span className="inline-block text-sm font-medium bg-background border px-3 py-1.5 rounded-md">
                          {formatarResposta(item)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )}
  </div>
</div>
  )
}