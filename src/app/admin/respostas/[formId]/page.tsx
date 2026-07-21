"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Calendar, User, Loader2, FileText, File, Download } from "lucide-react"
import { useParams } from "next/navigation"

export default function RespostasPage() {
  const params = useParams()
  const FORM_ID = params?.formId as string

  const [dados, setDados] = useState<any[]>([])
  const [perguntasMap, setPerguntasMap] = useState<Record<string, string>>({})
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const carregarDados = useCallback(async () => {
    if (!FORM_ID) return
    setLoading(true)
    try {
      const [resPostas, resForm] = await Promise.all([
        fetch(`/api/forms/respostas?formId=${FORM_ID}`),
        fetch(`/api/forms/details?id=${FORM_ID}`),
      ])

      const json = await resPostas.json()
      setDados(Array.isArray(json) ? json : [])

      if (resForm.ok) {
        const formData = await resForm.json()
        const map: Record<string, string> = {}
        ;(formData.questions || []).forEach((q: any) => {
          map[q.id] = q.pergunta
        })
        setPerguntasMap(map)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [FORM_ID])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

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
              const rawRespostas = reg.respostas
              // Normaliza: dict {questionId: valor} → array [{Pergunta, Resposta}]
              const respostas = Array.isArray(rawRespostas)
                ? rawRespostas
                : rawRespostas && typeof rawRespostas === "object"
                  ? Object.entries(rawRespostas).map(([key, value]) => ({
                      Pergunta: perguntasMap[key] || key,
                      Resposta: value,
                    }))
                  : []

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
                          {respostas.map((item: any, i: number) => {
                            const val = item?.Resposta ?? item?.resposta
                            // Normaliza: array de arquivos OU objeto único de arquivo
                            const isFileArray = Array.isArray(val) && val.length > 0 && val[0]?.url
                            const isSingleFile = !isFileArray && val && typeof val === "object" && val.url
                            const files = isFileArray ? val : isSingleFile ? [val] : []

                            return (
                              <div key={i} className="space-y-1">
                                <span className="text-[11px] text-gray-500 uppercase">
                                  {item?.Pergunta || item?.pergunta || "-"}
                                </span>
                                {files.length > 0 ? (
                                  <div className="space-y-2">
                                    {files.map((file: any, fi: number) => (
                                      file.type?.startsWith("image/") ? (
                                        <a key={fi} href={file.url} target="_blank" rel="noopener noreferrer">
                                          <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full max-h-48 object-contain rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer hover:opacity-80 transition"
                                          />
                                        </a>
                                      ) : (
                                        <a
                                          key={fi}
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                                        >
                                          {file.type === "application/pdf" ? (
                                            <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                                          ) : (
                                            <File className="h-8 w-8 text-blue-500 flex-shrink-0" />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">{file.name}</p>
                                            <p className="text-[10px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                          </div>
                                          <Download className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        </a>
                                      )
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-800 dark:text-white/90">
                                    {val || "-"}
                                  </p>
                                )}
                              </div>
                            )
                          })}
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