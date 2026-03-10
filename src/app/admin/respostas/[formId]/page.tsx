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
<<<<<<< HEAD
    <div className="min-h-screen bg-[#EFF6F4] dark:bg-[#1e293b] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 p-4 md:p-10">
=======
    /* AJUSTE DE COR: bg-white para claro e bg-[#1e293b] para escuro */
    <div className="min-h-screen bg-[#EFF6F4] dark:bg-[#0B161A] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 p-4 md:p-10">
>>>>>>> 36a486457429105f11fb3a26d86bf0c4499a9a5c
      <div className="max-w-5xl mx-auto">

        <header className="mb-12">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
            <ClipboardList size={14} />
            Gestão de Feedback
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight dark:text-white uppercase">
            Avaliações Recebidas
          </h1>

          <div className="h-1.5 w-24 bg-blue-600 mt-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
        </header>

        {erroAtivo && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-semibold">{erroAtivo}</p>
          </div>
        )}

        <div className="space-y-6">
          {dados.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-[2rem]">
              <p className="text-neutral-400 font-medium">Nenhuma resposta disponível.</p>
            </div>
          ) : (
            dados.map((registro, index) => {
              const isOpen = aberto === registro.id

              return (
                <div
                  key={registro.id}
                  className={`group transition-all duration-300 rounded-[2rem] border ${
                    isOpen
                      ? "border-blue-500/50 bg-white dark:bg-black/20 shadow-2xl ring-1 ring-blue-500/20"
                      : "border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/10 hover:border-neutral-300 dark:hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => setAberto(isOpen ? null : registro.id)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isOpen
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                            : "bg-neutral-100 dark:bg-white/5 text-neutral-400"
                        }`}
                      >
                        <User size={26} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg">
                            ID {dados.length - index}
                          </span>
                        </div>

                        <h3 className="font-black text-xl leading-none dark:text-neutral-100 uppercase">
                          Colaborador Anonimizado
                        </h3>

                        <p className="text-xs text-neutral-500 mt-2.5 flex items-center gap-1.5 font-bold">
                          <Calendar size={14} className="text-blue-500" />
                          {new Date(registro.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`transition-all duration-300 ${
                        isOpen ? "text-blue-600" : "text-neutral-300 dark:text-neutral-700"
                      }`}
                    >
                      <ChevronDown
                        className={`transition-transform duration-500 ${
                          isOpen ? "rotate-180 text-blue-500" : ""
                        }`}
                        size={28}
                      />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-10 pt-2 space-y-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent mb-8" />

                      {registro.respostas.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[1.5rem] bg-neutral-50/50 dark:bg-black/40 border border-neutral-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-black/60"
                        >
                          <div className="flex-1">
                            <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-500 tracking-[0.2em] mb-2">
                              Questão
                            </p>

                            <p className="text-base font-bold text-neutral-700 dark:text-neutral-200 leading-relaxed">
                              {formatarPergunta(item)}
                            </p>
                          </div>

                          <div className="md:text-right flex flex-col items-start md:items-end min-w-[120px]">
                            <p className="text-[10px] uppercase font-black text-neutral-400 dark:text-neutral-500 tracking-[0.2em] mb-2">
                              Resposta
                            </p>

                            <span className="inline-block px-5 py-2.5 bg-white dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-black rounded-xl border border-neutral-200 dark:border-blue-500/20 shadow-sm">
                              {formatarResposta(item)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}