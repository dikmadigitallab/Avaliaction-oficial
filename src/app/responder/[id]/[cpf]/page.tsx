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
      router.push("/responder/thanks")

      setAnswers({})
    } catch {
      toast.error("Erro ao enviar respostas")
    }
  }

  if (!form) return <p>Carregando formulário...</p>

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-900">
      <div
        className="w-full max-w-3xl bg-gray-800 text-white p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
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

            {q.type === "AVALIACAO" && (
              <div className="flex flex-row gap-2">
                {["Ótimo", "Bom", "Regular", "Ruim"].map((op) => (
                  <label key={op} className="flex items-center gap-2 cursor-pointer">
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
                className="bg-gray-700 border-gray-600 text-white p-2 rounded"
              >
                <option value="">Selecione...</option>
                {q.itens.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
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