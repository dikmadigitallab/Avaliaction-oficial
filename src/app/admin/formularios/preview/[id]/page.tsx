"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

  if (!form) return <p>Carregando formulário...</p>

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-background text-foreground">
    <div
      className="w-full max-w-3xl bg-card text-card-foreground p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-y-auto border border-border animate-scale-in"
      style={{ maxHeight: "90vh" }}
    >
      <h1 className="text-3xl font-bold text-center text-primary">
        {form.name}
      </h1>
  
      <p className="text-center text-sm text-muted-foreground">
        Pré-visualização do formulário
      </p>
  
      {form.questions.map((q) => (
        <div key={q.id} className="flex flex-col gap-2">
          <label className="font-medium text-foreground">
            {q.pergunta} {q.required && "*"}
          </label>
  
          {q.type === "TEXT" && (
            <Input
              disabled
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="bg-input border-border text-foreground"
            />
          )}
  
          {(q.type === "BOOLEAN" || q.type === "LIST") && q.options && (
            <select
              disabled
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="bg-input border border-border rounded-md p-2 text-foreground"
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
                    disabled
                    className={`text-3xl ${
                      ativo ? "text-primary" : "text-muted-foreground"
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
                  <input type="radio" disabled className="accent-primary" />
                  {opt}
                </label>
              ))}
            </div>
          )}
  
          {q.type === "CHECKBOX" && q.options && (
            <div className="flex flex-col gap-2">
              {q.options.map((opt) => (
                <label key={opt} className="flex gap-2 items-center">
                  <input type="checkbox" disabled className="accent-primary" />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
  
      <div className="flex justify-center mt-4">
        <Button disabled className="px-8 py-3">
          Enviar respostas
        </Button>
      </div>
    </div>
  </div>
  )
}