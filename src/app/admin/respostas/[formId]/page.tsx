"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Calendar, User, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

export default function RespostasPage() {
  const params = useParams()
  const FORM_ID = params?.formId as string

  const [dados, setDados] = useState<any[]>([])
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const carregarRespostas = useCallback(async () => {
    if (!FORM_ID) return
    setLoading(true)
    try {
      const res = await fetch(`/api/forms/respostas?formId=${FORM_ID}`)
      const json = await res.json()
      setDados(Array.isArray(json) ? json : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [FORM_ID])

  useEffect(() => {
    carregarRespostas()
  }, [carregarRespostas])

  const total = dados.length
  const ultima = dados[0]?.createdAt

  const abrir = (index: number) => {
    setAbertoIndex((prev) => (prev === index ? null : index))
  }

  const proximo = () => {
    if (abertoIndex === null) return
    if (abertoIndex < total - 1) setAbertoIndex(abertoIndex + 1)
  }

  const anterior = () => {
    if (abertoIndex === null) return
    if (abertoIndex > 0) setAbertoIndex(abertoIndex - 1)
  }

  return (
    <div className="min-h-screen bg-[#EFF6F4] dark:bg-[#0B161A] text-gray-900 dark:text-slate-200 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">TOTAL DE RESPOSTAS</p>
            <p className="text-2xl font-semibold">{total}</p>
          </div>

          <div className="bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">ÚLTIMA RESPOSTA</p>
            <p className="text-sm">
              {ultima
                ? new Date(ultima).toLocaleString("pt-BR")
                : "-"}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">STATUS</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Ativo</span>
            </div>
          </div>

        </div>

        {/* LISTA */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="space-y-3">

            {dados.map((reg, idx) => {
              const isOpen = abertoIndex === idx
              const respostas = Array.isArray(reg.respostas) ? reg.respostas : []

              return (
                <div
                  key={reg.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-emerald-500/40 bg-gray-100 dark:bg-white/[0.04]"
                      : "border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                  }`}
                >

                  {/* HEADER */}
                  <div
                    onClick={() => abrir(idx)}
                    className="flex items-center justify-between p-5 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <User size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Registro #{total - idx}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <Calendar size={12} />
                          <span className="text-xs">
                            {new Date(reg.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-gray-900 dark:text-white" : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* DETALHES */}
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-6 border-t border-gray-200 dark:border-white/5">

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
                          {respostas.map((item: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <span className="text-[11px] text-gray-500 uppercase">
                                {item?.Pergunta || item?.pergunta || "-"}
                              </span>
                              <p className="text-sm text-gray-800 dark:text-white/90">
                                {typeof item?.Resposta === "object"
                                  ? JSON.stringify(item?.Resposta)
                                  : item?.Resposta || "-"}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* NAVEGAÇÃO */}
                        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-white/5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              anterior()
                            }}
                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                          >
                            ← Anterior
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              proximo()
                            }}
                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                          >
                            Próxima →
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              )
            })}

          </div>
        )}

      </div>
    </div>
  )
}