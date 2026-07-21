"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ImageIcon, X, FileText, File } from "lucide-react"

type QuestionType =
  | "TEXT"
  | "AVALIACAO"
  | "CHECKBOX"
  | "RADIO"
  | "LIST"
  | "TITULO"
  | "IMAGEM"

interface Question {
  id: string
  pergunta: string
  type: QuestionType
  required: boolean
  order: number
  itens?: string[]
}

interface Form {
  id: string
  name: string
  questions: Question[]
}

export default function FormResponsePage() {
  const params = useParams()
  const formId = params?.id as string | undefined
  const cpf = params?.cpf as string | undefined

  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  const router = useRouter()

  useEffect(() => {
    if (!formId) return

    const loadForm = async () => {
      try {
        const res = await fetch(`/api/forms/details?id=${formId}`)
        if (!res.ok) {
          const err = await res.json()
          toast.error(err.error || "Erro ao carregar formulário")
          return
        }
        const data = await res.json()
        setForm(data)
      } catch {
        toast.error("Erro ao carregar formulário")
      }
    }

    loadForm()
  }, [formId])

  const handleChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleCheckboxChange = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : []
      if (current.includes(option)) {
        return {
          ...prev,
          [questionId]: current.filter((o: string) => o !== option),
        }
      }
      return {
        ...prev,
        [questionId]: [...current, option],
      }
    })
  }

  const handleFileChange = async (questionId: string, file: File | null) => {
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 10MB")
      return
    }

    try {
      const uploadKey = `${questionId}-${Date.now()}`
      setUploading((prev) => ({ ...prev, [uploadKey]: true }))

      const formData = new FormData()
      formData.append("file", file)
      formData.append("formId", formId || "")
      formData.append("questionId", questionId)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erro ao enviar arquivo")
        return
      }

      const data = await res.json()
      const newFile = {
        url: data.url,
        name: data.name,
        type: data.type,
        size: data.size,
      }

      setAnswers((prev) => {
        const current = Array.isArray(prev[questionId]) ? prev[questionId] : []
        return {
          ...prev,
          [questionId]: [...current, newFile],
        }
      })
    } catch {
      toast.error("Erro ao enviar arquivo")
    } finally {
      setUploading((prev) => {
        const next = { ...prev }
        // Remove todas as keys de uploading deste questionId
        Object.keys(next).forEach((k) => {
          if (k.startsWith(questionId)) delete next[k]
        })
        return next
      })
    }
  }

  const handleRemoveFile = (questionId: string, fileIndex: number) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : []
      const updated = current.filter((_: any, i: number) => i !== fileIndex)
      if (updated.length === 0) {
        const next = { ...prev }
        delete next[questionId]
        return next
      }
      return { ...prev, [questionId]: updated }
    })
  }

  const handleSubmit = async () => {
    if (!form) return

    for (const q of form.questions) {
      if (q.type === "TITULO") continue

      if (
        q.required &&
        (answers[q.id] === undefined ||
          answers[q.id] === "" ||
          (Array.isArray(answers[q.id]) && answers[q.id].length === 0))
      ) {
        alert(`Resposta obrigatória: ${q.pergunta}`)
        return
      }
    }

    try {
      setSending(true)
      const respostasFormatadas: Record<string, any> = {}
      form.questions
        .filter((q) => q.type !== "TITULO")
        .forEach((q) => {
          const ans = answers[q.id]
          if (q.type === "IMAGEM" && Array.isArray(ans) && ans.length > 0) {
            // Para arquivos, salva array de URL + metadados
            respostasFormatadas[q.id] = ans.map((f: any) => ({
              url: f.url,
              name: f.name,
              type: f.type,
              size: f.size,
            }))
          } else {
            respostasFormatadas[q.id] = Array.isArray(ans)
              ? ans.join(", ")
              : ans ?? ""
          }
        })

      const res = await fetch(`/api/forms/respostas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form.id,
          cpf,
          respostas: respostasFormatadas,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erro ao enviar respostas")
        setSending(false)
        return
      }

      toast.success("Respostas enviadas com sucesso!")
      router.push("/responder/thanks")
      setAnswers({})
    } catch {
      toast.error("Erro ao enviar respostas")
      setSending(false)
    }
  }

  if (!form)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#031b1c] text-white">
        Carregando formulário...
      </div>
    )

    return (
      <div className="relative min-h-screen flex justify-center items-start p-6 bg-[#021415] overflow-hidden">
        
        <div
          style={{ backgroundImage: "url('/assets/felizes.avif')" }}
          className="absolute inset-0 bg-cover bg-center opacity-20"
        />
    
        <div className="relative z-10 w-full max-w-3xl bg-[#06292b]/95 border border-[#0e3f41] rounded-3xl shadow-xl overflow-hidden">
          
          {/* HEADER */}
          <div className="flex flex-col items-center gap-3 px-6 py-6 border-b border-[#0e3f41]">
            <Image
              src="https://i.ibb.co/Z61BpdnN/download.png"
              alt="Logo"
              width={140}
              height={50}
              className="opacity-80"
              priority
            />
            <h1 className="text-xl sm:text-2xl font-semibold text-white text-center">
              {form.name}
            </h1>
          </div>
    
          <div className="p-6 flex flex-col gap-5">
    
            {form.questions
              .filter((q) => !q.pergunta.startsWith("@INDICADOR:"))
              .map((q) => {
              const isTitle = q.type === "TITULO"
    
              return (
                <div key={q.id} className="flex flex-col gap-2">
                  
                  {isTitle ? (
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                      {q.pergunta}
                    </h2>
                  ) : (
                    <>
                      <label className="text-sm text-white font-medium">
                        {q.pergunta}
                        {q.required && (
                          <span className="text-[#18c2a4] ml-1">*</span>
                        )}
                      </label>
    
                      {q.type === "TEXT" && (
                        <Input
                          value={answers[q.id] || ""}
                          onChange={(e) =>
                            handleChange(q.id, e.target.value)
                          }
                          className="h-11 bg-[#021415] border border-[#0e3f41] rounded-lg text-white px-3 focus:border-[#18c2a4] focus:ring-1 focus:ring-[#18c2a4]/20 placeholder:text-gray-500"
                          placeholder="Digite aqui"
                        />
                      )}
    
                      {q.type === "AVALIACAO" && (
                        <div className="flex gap-2 flex-wrap">
                          {["Ótimo", "Bom", "Regular", "Ruim"].map((op) => (
                            <label
                              key={op}
                              className={`px-3 py-2 rounded-md text-sm border cursor-pointer transition ${
                                answers[q.id] === op
                                  ? "border-[#18c2a4] text-white bg-[#18c2a4]/10"
                                  : "border-[#0e3f41] text-gray-300 hover:border-[#18c2a4]"
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={op}
                                checked={answers[q.id] === op}
                                onChange={() =>
                                  handleChange(q.id, op)
                                }
                                className="hidden"
                              />
                              {op}
                            </label>
                          ))}
                        </div>
                      )}
    
                      {q.type === "RADIO" && q.itens && (
                        <div className="flex flex-col gap-2">
                          {q.itens.filter((i) => !i.startsWith("@METRIC:")).map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm cursor-pointer transition ${
                                answers[q.id] === opt
                                  ? "border-[#18c2a4] bg-[#18c2a4]/10"
                                  : "border-[#0e3f41] hover:border-[#18c2a4]"
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={answers[q.id] === opt}
                                onChange={() =>
                                  handleChange(q.id, opt)
                                }
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
    
                      {q.type === "CHECKBOX" && q.itens && (
                        <div className="flex flex-col gap-2">
                          {q.itens.filter((i) => !i.startsWith("@METRIC:")).map((opt) => (
                            <label
                              key={opt}
                              className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#0e3f41] text-sm cursor-pointer hover:border-[#18c2a4] transition"
                            >
                              <input
                                type="checkbox"
                                value={opt}
                                checked={(answers[q.id] || []).includes(opt)}
                                onChange={() =>
                                  handleCheckboxChange(q.id, opt)
                                }
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
    
                      {q.type === "LIST" && q.itens && (
                        <select
                          value={answers[q.id] || ""}
                          onChange={(e) =>
                            handleChange(q.id, e.target.value)
                          }
                          className="h-11 bg-[#021415] border border-[#0e3f41] rounded-lg text-white px-3 focus:border-[#18c2a4] focus:ring-1 focus:ring-[#18c2a4]/20"
                        >
                          <option value="">Selecionar</option>
                          {q.itens.filter((i) => !i.startsWith("@METRIC:")).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {q.type === "IMAGEM" && (
                        <div className="space-y-3">
                          {/* Lista de arquivos já enviados */}
                          {Array.isArray(answers[q.id]) && answers[q.id].length > 0 && (
                            <div className="space-y-2">
                              {answers[q.id].map((file: any, idx: number) => (
                                <div key={idx} className="relative group">
                                  {file.type?.startsWith("image/") ? (
                                    <div className="relative">
                                      <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full max-h-48 object-contain rounded-lg border border-[#0e3f41]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(q.id, idx)}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3 p-3 bg-[#021415] rounded-lg border border-[#0e3f41] group-hover:border-red-500/40 transition">
                                      {file.type === "application/pdf" ? (
                                        <FileText className="h-8 w-8 text-red-400 flex-shrink-0" />
                                      ) : (
                                        <File className="h-8 w-8 text-blue-400 flex-shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{file.name}</p>
                                        <p className="text-[10px] text-gray-500">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(q.id, idx)}
                                        className="p-1.5 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Upload */}
                          {Object.keys(uploading).some((k) => k.startsWith(q.id)) ? (
                            <div className="flex items-center justify-center h-32 border-2 border-dashed border-[#0e3f41] rounded-lg bg-[#021415]">
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 border-2 border-[#18c2a4] border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-gray-400">Enviando...</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-[#0e3f41] rounded-lg cursor-pointer hover:border-[#18c2a4] transition-colors bg-[#021415]">
                                <ImageIcon className="h-7 w-7 text-gray-500" />
                                <span className="text-sm text-gray-400">
                                  {Array.isArray(answers[q.id]) && answers[q.id].length > 0
                                    ? "Adicionar mais arquivos"
                                    : "Clique para enviar um arquivo"}
                                </span>
                                <span className="text-[10px] text-gray-500">Imagens, PDF, DOC, XLSX (máx. 10MB)</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(q.id, e.target.files?.[0] || null)}
                                />
                              </label>
                              <label className="flex items-center justify-center gap-2 h-11 border border-[#0e3f41] rounded-lg cursor-pointer hover:border-[#18c2a4] transition-colors bg-[#021415]">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                                <span className="text-sm text-gray-400">Tirar foto com a câmera</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(q.id, e.target.files?.[0] || null)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
    
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full py-4 rounded-xl bg-[#18c2a4] hover:bg-[#22d3b6] text-black font-semibold transition"
              >
                {sending ? "Enviando..." : "Enviar respostas"}
              </Button>
            </div>
    
          </div>
        </div>
      </div>
    )
}