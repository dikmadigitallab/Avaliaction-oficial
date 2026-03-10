"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type QuestionType =
  | "TEXT"
  | "AVALIACAO"
  | "BOOLEAN"
  | "CHECKBOX"
  | "RADIO"
  | "LIST"

interface Question {
  id: string
  pergunta: string
  type: QuestionType
  required: boolean
  order: number
  options?: string[]
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
        return
      }

      toast.success("Respostas enviadas com sucesso!")
      setAnswers({})
    } catch {
      toast.error("Erro ao enviar respostas")
    }
  }

  if (!form) return <p>Carregando formulário...</p>

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 text-white p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: "90vh" }}>
        <h1 className="text-3xl font-bold text-center">{form.name}</h1>

        {form.questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-2">
            <label className="font-medium">
              {q.pergunta} {q.required && "*"}
            </label>

            {q.type === "TEXT" && (
              <Input
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              />
            )}

            {(q.type === "BOOLEAN" || q.type === "LIST") && q.options && (
              <select
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded p-2"
              >
                <option value="">Selecione</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {q.type === "AVALIACAO" && (
              <div className="flex gap-2">
                {Array.from({ length: q.options?.length || 5 }).map((_, i) => {
                  const value = i + 1
                  const ativo = (answers[q.id] || 0) >= value

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange(q.id, value)}
                      className={`text-3xl transition ${
                        ativo
                          ? "text-yellow-400"
                          : "text-gray-500 hover:text-yellow-300"
                      }`}
                    >
                      ★
                    </button>
                  )
                })}
              </div>
            )}

            {q.type === "RADIO" && q.options && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt) => (
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

            {q.type === "CHECKBOX" && q.options && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt) => (
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
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <Button onClick={handleSubmit} className="px-8 py-3">
            Enviar respostas
          </Button>
        </div>
      </div>
    </div>
  )
}