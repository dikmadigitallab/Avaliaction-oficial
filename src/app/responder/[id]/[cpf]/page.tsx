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
  title: string
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
  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})



  useEffect(() => {
    if (!formId) return
    fetch(`/api/forms?id=${formId}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch(() => toast.error("Erro ao carregar formulário"))
  }, [formId])

  const handleChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (!form) return

    // Validar respostas obrigatórias
    for (const q of form.questions) {
      if (q.required && (answers[q.id] === undefined || answers[q.id] === "")) {
        toast.error(`Resposta obrigatória: ${q.title}`)
        return
      }
    }

    try {
      await fetch(`/api/forms?id=${form.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: form.id, answers }),
      })
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
          {q.title} {q.required && "*"}
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
            onChange={(e) => handleChange(q.id, Number(e.target.value))}
            className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
          />
        )}

        {/* Checkbox e Radio podem ser adicionados aqui */}
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