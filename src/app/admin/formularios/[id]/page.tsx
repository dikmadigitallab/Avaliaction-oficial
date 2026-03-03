"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

type QuestionType =
  | "TEXT"
  | "AVALIACAO"
  | "BOOLEAN"
  | "CHECKBOX"
  | "RADIO"

type Question = {
  id: string
  title: string
  type: QuestionType
  required: boolean
}

export default function FormPage() {
  const router = useRouter()
  const params = useParams()
  const formId = params?.id as string | undefined

  const [name, setName] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        type: "TEXT",
        required: false,
      },
    ])
  }

  const updateQuestion = (id: string, data: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...data } : q))
    )
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit = async () => {
    if (!name.trim()) return

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, anonymous: true }),
      })

      const form = await res.json()

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]

        await fetch(`/api/forms/questions?formId=${form.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: q.title,
            type: q.type,
            required: q.required,
            order: i,
          }),
        })
      }

      toast.success("Formulario criado")
      router.push("/administracao/formularios")
    } catch {
      toast.error("Erro ao salvar")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Input
        placeholder="Nome do formulario"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {questions.map((question) => (
        <div key={question.id} className="border rounded-lg p-4 space-y-4">
          <Input
            placeholder="Titulo da pergunta"
            value={question.title}
            onChange={(e) =>
              updateQuestion(question.id, {
                title: e.target.value,
              })
            }
          />

          <Select
            value={question.type}
            onValueChange={(value: QuestionType) =>
              updateQuestion(question.id, { type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Texto</SelectItem>
              <SelectItem value="AVALIACAO">Avaliacao</SelectItem>
              <SelectItem value="BOOLEAN">Sim ou nao</SelectItem>
              <SelectItem value="CHECKBOX">Multipla escolha</SelectItem>
              <SelectItem value="RADIO">Escolha unica</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={question.required}
                onCheckedChange={(checked) =>
                  updateQuestion(question.id, {
                    required: checked,
                  })
                }
              />
              <span className="text-sm">Obrigatoria</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeQuestion(question.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={addQuestion}
      >
        <Plus className="h-4 w-4" />
        Adicionar pergunta
      </Button>

      <Button className="w-full" onClick={handleSubmit}>
        Salvar formulario
      </Button>
    </div>
  )
}