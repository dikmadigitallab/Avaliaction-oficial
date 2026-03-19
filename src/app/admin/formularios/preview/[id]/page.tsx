"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

export default function FormPreviewPage() {
  const params = useParams()
  const formId = params?.id as string | undefined

  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!formId) return

    const loadForm = async () => {
      try {
        const res = await fetch(`/api/forms/details?id=${formId}`)
        const data = await res.json()
        setForm(data)
      } catch {}
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

  if (!form)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Carregando formulário...
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        
        <div className="bg-[#06292b] border border-[#0e3f41] rounded-2xl p-6 text-center shadow-lg">
          <h1 className="text-3xl font-semibold text-white">{form.name}</h1>
          <p className="text-sm text-gray-400 mt-2">
            Pré-visualização do formulário
          </p>
        </div>

        {form.questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#06292b] border border-[#0e3f41] rounded-2xl p-5 shadow-md flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <span className="text-lg text-gray-200">
                {index + 1}. {q.pergunta}
              </span>
              {q.required && (
                <span className="text-xs text-red-400">Obrigatório</span>
              )}
            </div>

            {q.type === "TEXT" && (
              <Input
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="h-12 rounded-xl bg-[#031b1c] border border-[#0e3f41]"
              />
            )}

            {q.type === "AVALIACAO" && (
              <div className="flex flex-wrap gap-3">
                {(q.itens && q.itens.length > 0
                  ? q.itens
                  : ["Ótimo", "Bom", "Regular", "Ruim"]
                ).map((op) => (
                  <label
                    key={op}
                    className={`px-4 py-2 rounded-xl border cursor-pointer transition text-sm
                    ${
                      answers[q.id] === op
                        ? "bg-[#18c2a4] text-black border-[#18c2a4] border"
                        : "bg-[#031b1c] border-[#0e3f41] border hover:border-[#18c2a4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={op}
                      checked={answers[q.id] === op}
                      onChange={() => handleChange(q.id, op)}
                      className="hidden"
                    />
                    {op}
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

        <div className="flex justify-center pt-4">
          <Button
            disabled
            className="px-10 py-5 text-lg rounded-2xl bg-gray-600"
          >
            Enviar respostas
          </Button>
        </div>
      </div>
    </div>
  )
}