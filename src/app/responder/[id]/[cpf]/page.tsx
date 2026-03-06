"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  setAnswers((prev) => {
    const updated = {
      ...prev,
      [questionId]: value,
    }

    return updated
  })
}

const handleCheckboxChange = (questionId: string, option: string) => {
  setAnswers((prev) => {
    const current = Array.isArray(prev[questionId]) ? prev[questionId] : []

    let updated

    if (current.includes(option)) {
      updated = {
        ...prev,
        [questionId]: current.filter((o: string) => o !== option),
      }
    } else {
      updated = {
        ...prev,
        [questionId]: [...current, option],
      }
    }

    console.log("answers update:", updated)
    return updated
  })
}

const handleSubmit = async () => {
  if (!form) return

  console.log("submit answers:", answers)

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

    console.log("respostasFormatadas:", respostasFormatadas)

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

            {(q.type === "BOOLEAN" || q.type === "LIST") && q.options && (
              <select
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded p-2 placeholder-gray-400"
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
              <Input
                type="number"
                min={1}
                max={q.options?.length || 5}
                value={answers[q.id] || ""}
                onChange={(e) =>
                  handleChange(q.id, Number(e.target.value))
                }
                className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              />
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