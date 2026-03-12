"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

type QuestionType =
  | "TEXT"
  | "AVALIACAO"
  | "CHECKBOX"
  | "RADIO"
  | "LIST"

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

  const handleSubmit = async () => {
    if (!form) return

    for (const q of form.questions) {
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

      const respostasFormatadas = form.questions.map((q) => ({
        Pergunta: q.pergunta,
        Resposta: Array.isArray(answers[q.id])
          ? answers[q.id].join(", ")
          : answers[q.id] ?? "",
      }))

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
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-[#06292b] border border-[#0e3f41] rounded-3xl shadow-2xl p-10 flex flex-col gap-8 text-white overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-semibold text-center tracking-wide"
        >
          {form.name}
        </motion.h1>

        {form.questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex flex-col gap-3"
          >
            <label className="text-lg text-gray-200">
              {q.pergunta} {q.required && "*"}
            </label>

            {q.type === "TEXT" && (
              <Input
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="h-12 rounded-xl bg-[#031b1c] border border-[#0e3f41] focus:border-[#18c2a4] focus:ring-2 focus:ring-[#18c2a4]/40"
              />
            )}

            {q.type === "AVALIACAO" && (
              <div className="flex flex-wrap gap-3">
                {["Ótimo", "Bom", "Regular", "Ruim"].map((op) => (
                  <label
                    key={op}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#0e3f41] bg-[#031b1c] cursor-pointer hover:border-[#18c2a4] transition"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={op}
                      checked={answers[q.id] === op}
                      onChange={() => handleChange(q.id, op)}
                    />
                    <span>{op}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "RADIO" && q.itens && (
              <div className="flex flex-col gap-2">
                {q.itens.map((opt) => (
                  <label key={opt} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "CHECKBOX" && q.itens && (
              <div className="flex flex-col gap-2">
                {q.itens.map((opt) => (
                  <label key={opt} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={(answers[q.id] || []).includes(opt)}
                      onChange={() => handleCheckboxChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "LIST" && q.itens && (
              <select
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="bg-[#031b1c] border border-[#0e3f41] text-white p-2 rounded-xl h-12"
              >
                <option value="">Selecione...</option>
                {q.itens.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
        ))}

        <div className="flex justify-center pt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={sending}
              className="px-10 py-6 text-lg rounded-2xl bg-[#18c2a4] hover:bg-[#22d3b6] text-black font-semibold shadow-lg shadow-[#18c2a4]/30 transition flex items-center gap-3"
            >
              {sending && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                />
              )}
              {sending ? "Enviando..." : "Enviar respostas"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}