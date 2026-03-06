"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Calendar, User, ClipboardList, Loader2, AlertCircle } from "lucide-react"

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

const FORM_ID = "70260ca3-faab-41ca-9203-a306f73b5c25"

export default function RespostasPage() {
  const [mounted, setMounted] = useState(false)
  const [dados, setDados] = useState<Registro[]>([])
  const [aberto, setAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erroAtivo, setErroAtivo] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const carregarRespostas = useCallback(async () => {
    setLoading(true)
    setErroAtivo(null)
    try {
      const res = await fetch(`/api/forms/respostas?formId=${FORM_ID}`)
      if (!res.ok) throw new Error("Erro na conexão")
      
      const json = await res.json()
      const dadosTratados: Registro[] = (Array.isArray(json) ? json : []).map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        createdAt: item.createdAt || new Date().toISOString(),
        respostas: Array.isArray(item.respostas) ? item.respostas : []
      }))

      setDados(dadosTratados)
    } catch (err) {
      setErroAtivo("Falha ao sincronizar dados com o servidor.")
    } finally {
      setLoading(false)
    }
  }, [])

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
    // Removido bg-neutral-950 para usar black puro ou herdar do admin
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-500 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
            <ClipboardList size={14} />
            Gestão de Feedback
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight dark:text-white">Avaliações Recebidas</h1>
          <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
        </header>

        {erroAtivo && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-semibold">{erroAtivo}</p>
          </div>
        )}

        <div className="space-y-4">
          {dados.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-[2rem]">
              <p className="text-neutral-400 font-medium italic">Nenhuma resposta disponível.</p>
            </div>
          ) : (
            dados.map((registro, index) => {
              const isOpen = aberto === registro.id
              return (
                <div 
                  key={registro.id}
                  // Usando transparências (bg-white/5) para herdar a cor de fundo do seu Admin
                  className={`group transition-all duration-300 rounded-[1.5rem] border ${
                    isOpen 
                    ? "border-blue-500/50 bg-white dark:bg-white/[0.04] shadow-2xl ring-1 ring-blue-500/20" 
                    : "border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
                  }`}
                >
                  <button 
                    onClick={() => setAberto(isOpen ? null : registro.id)}
                    className="w-full flex items-center justify-between p-5 md:p-7 text-left outline-none"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-neutral-100 dark:bg-white/5 text-neutral-400"
                      }`}>
                        <User size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                            ID {dados.length - index}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg leading-none dark:text-neutral-100">Colaborador Anonimizado</h3>
                        <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1 font-medium italic">
                          <Calendar size={12} />
                          {new Date(registro.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className={`transition-all duration-300 ${isOpen ? "text-blue-600" : "text-neutral-300 dark:text-neutral-700"}`}>
                      <ChevronDown className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} size={24} />
                    </div>
                  </button>

                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-5 md:px-7 pb-8 pt-2 space-y-3">
                      <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent mb-6" />
                      
                      {registro.respostas.map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-50/50 dark:bg-black/40 border border-neutral-100 dark:border-white/5 transition-all">
                          <div className="flex-1">
                            <p className="text-[9px] uppercase font-black text-neutral-400 dark:text-neutral-500 tracking-[0.15em] mb-1">Questão</p>
                            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200 leading-relaxed">
                              {formatarPergunta(item)}
                            </p>
                          </div>
                          <div className="md:text-right flex flex-col items-start md:items-end">
                            <p className="text-[9px] uppercase font-black text-neutral-400 dark:text-neutral-500 tracking-[0.15em] mb-1">Resposta</p>
                            <span className="inline-block px-4 py-2 bg-white dark:bg-white/5 text-blue-600 dark:text-blue-400 text-sm font-black rounded-xl border border-neutral-200 dark:border-white/10 shadow-sm">
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