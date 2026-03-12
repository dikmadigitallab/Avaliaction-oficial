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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFF6F4] dark:bg-[#0B161A] text-black dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#EFF6F4] dark:bg-[#0B161A] text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto space-y-10 p-6 md:p-10">

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Avaliações recebidas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Respostas enviadas para este formulário
          </p>
        </header>

        {erroAtivo && (
          <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={18} />
            <span className="text-sm">{erroAtivo}</span>
          </div>
        )}

        {dados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400">
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
                  className="border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#111e22] transition hover:border-emerald-400/40"
                >
                  <button
                    onClick={() => setAberto(isOpen ? null : registro.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#0B161A] border border-gray-200 dark:border-white/10">
                        <User size={18} />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Resposta #{dados.length - index}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(registro.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        isOpen
                          ? "rotate-180 text-emerald-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-200 dark:border-white/10 px-5 pb-5 pt-4 space-y-4">
                      {registro.respostas.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0B161A] p-4 flex flex-col gap-3"
                        >
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Pergunta
                            </p>

                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatarPergunta(item)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Resposta
                            </p>

                            <span className="inline-block text-sm font-medium bg-white dark:bg-[#111e22] border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-md">
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