"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Calendar, User, ClipboardList, Loader2, AlertCircle } from "lucide-react"
import { useParams } from "next/navigation"

interface ItemResposta {
  Pergunta?: string
  pergunta?: string
  Resposta?: any
  resposta?: any
  options?: string[]
  type?: string
}

interface Registro {
  id: string
  createdAt: string
  respostas: ItemResposta[]
}

const OPCOES_AVALIACAO_PADRAO = ["Ótimo", "Bom", "Regular", "Ruim"]

export default function RespostasPage() {
  const params = useParams()
  const FORM_ID = params?.formId as string

  const [mounted, setMounted] = useState(false)
  const [dados, setDados] = useState<Registro[]>([])
  const [aberto, setAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erroAtivo, setErroAtivo] = useState<string | null>(null)
  const [observacao, setObservacao] = useState("nenhuma observação")

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
        respostas: Array.isArray(item.respostas)
          ? item.respostas.map((r: any) => ({
            ...r,
            options: r.options || r.opcoes || [],
            type: r.type || r.tipo || ""
          }))
          : []
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



  const formatarPergunta = (item: ItemResposta) =>
    item.Pergunta ?? item.pergunta ?? "Sem título"



  const getResposta = (item: ItemResposta) => {
    const val = item.Resposta ?? item.resposta
    if (val === null || val === undefined || val === "") return "-"
    if (typeof val === "object") {
      if (Array.isArray(val)) return val.join(", ")
      return val.label || val.value || JSON.stringify(val)
    }
    return String(val)
  }

useEffect(() => {
  const fetchResposta = async () => {
    try {
      const res = await fetch(`/api/forms/respostas?formId=${FORM_ID}`)
      const data = await res.json()

      if (res.ok && data.length > 0) {
        setObservacao(data[0].observacao || "")
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (FORM_ID) {
    fetchResposta()
  }
}, [FORM_ID])



  const handleSalvar = async () => {
    if (!observacao.trim()) {
      alert("Digite uma observação")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/forms/respostas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formId: FORM_ID,
          observacao
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar")
      }

      alert("Observação salva com sucesso")
      setObservacao("")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }



  if (!mounted) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF6F4] dark:bg-[#0B161A]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
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
        </header>

        {erroAtivo && (
          <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-600">
            <AlertCircle size={18} />
            <span className="text-sm">{erroAtivo}</span>
          </div>
        )}

        {dados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border rounded-xl">
            <ClipboardList size={32} className="mb-3 opacity-40" />
            <p className="text-sm">Nenhuma resposta encontrada</p>
          </div>
        ) : (
          <div className="space-y-5">
            {dados.map((registro, index) => {
              const isOpen = aberto === registro.id

              return (
                <div key={registro.id} className="border rounded-xl bg-white dark:bg-[#111e22]">
                  <button
                    onClick={() => setAberto(isOpen ? null : registro.id)}
                    className="w-full flex items-center justify-between p-5"
                  >
                    <div className="flex items-center gap-4">
                      <User size={18} />
                      <div>
                        <p className="text-sm font-medium">
                          Resposta #{dados.length - index}
                        </p>
                        <p className="text-xs text-gray-500">
                          <Calendar size={13} className="inline mr-1" />
                          {new Date(registro.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={isOpen ? "rotate-180 text-emerald-500" : ""}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t px-5 pb-5 pt-4 space-y-4">
                      {registro.respostas.map((item, i) => {
                        const resposta = getResposta(item)

                        const isAvaliacao =
                          item.type === "avaliacao" ||
                          ["Ótimo", "Bom", "Regular", "Ruim"].includes(resposta)

                        const opcoes =
                          item.options && item.options.length > 0
                            ? item.options
                            : OPCOES_AVALIACAO_PADRAO

                        return (
                          <div key={i} className="p-4 border rounded-lg flex flex-col gap-3">
                            <p className="text-sm font-medium">
                              {formatarPergunta(item)}
                            </p>

                            {isAvaliacao ? (
                              <div className="flex gap-2 flex-wrap">
                                {opcoes.map((opt, idx) => {
                                  const selecionado = resposta === String(opt)

                                  return (
                                    <div
                                      key={idx}
                                      className={`px-4 py-2 rounded-lg border text-sm transition
                                        ${selecionado
                                          ? "bg-green-500 text-white border-green-500"
                                          : "bg-transparent border-gray-300 dark:border-white/20 text-gray-400"
                                        }
                                      `}
                                    >
                                      {opt}
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <span className="text-sm border px-3 py-1.5 rounded-md">
                                {resposta}
                              </span>
                            )}
                          </div>
                        )
                      })}
                      <div className="flex flex-col gap-2 text-sm border p-3 rounded-md">
                        <label htmlFor="observacao" className="font-medium">
                          Observação
                        </label>

                        <input
                          id="observacao"
                          name="observacao"
                          type="text"
                          value={observacao}
                          onChange={(e) => setObservacao(e.target.value)}
                          placeholder="Digite sua observação"
                          className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <button
                          type="button"
                          onClick={handleSalvar}
                          disabled={loading}
                          className="mt-2 bg-primary text-white rounded-md px-3 py-1.5 hover:opacity-90 transition disabled:opacity-50"
                        >
                          {loading ? "Salvando..." : "Salvar observação"}
                        </button>
                      </div>
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