"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Trash2,
  Save,
  Star,
  AlignLeft,
  CheckSquare,
  Circle,
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export type QuestionType =
  | "TEXT"
  | "AVALIACAO"
  | "CHECKBOX"
  | "RADIO"
  | "LIST"

export interface FormQuestion {
  id: string
  text: string
  type: QuestionType
  maxScore?: number
  options?: string[]
  itens?: string[]
}

interface FormBuilderProps {
  initialName?: string
  initialQuestions?: FormQuestion[]
  submitLabel?: string
}

export function FormBuilder({
  initialName = "",
  initialQuestions = [],
  submitLabel = "Salvar formulario",
}: FormBuilderProps) {

  const [formName, setFormName] = useState(initialName)
  const [questions, setQuestions] = useState<FormQuestion[]>(initialQuestions)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)

  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | "">("")
  const [valores, setValores] = useState<string>("Ótimo, Bom, Regular, Ruim")

  const [newOptions, setNewOptions] = useState<string[]>([])
  const [newOptionText, setNewOptionText] = useState("")

  const session = useSession()
  const id = session.data?.user?.id

  const resetNewQuestion = () => {
    setNewQuestionText("")
    setNewQuestionType("")
    setValores("")
    setNewOptions([])
    setNewOptionText("")
    setIsAddingQuestion(false)
  }

  const handleAddOption = () => {
    if (!newOptionText.trim()) return
    setNewOptions((prev) => [...prev, newOptionText.trim()])
    setNewOptionText("")
  }

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error("Informe o texto da pergunta.")
      return
    }

    if (!newQuestionType) {
      toast.error("Selecione o tipo da pergunta.")
      return
    }

    if (
      newQuestionType === "CHECKBOX" ||
      newQuestionType === "RADIO" ||
      newQuestionType === "LIST"
    ) {
      if (newOptions.length === 0) {
        toast.error("Informe as opções.")
        return
      }
    }

    const question: FormQuestion = {
      id: crypto.randomUUID(),
      text: newQuestionText.trim(),
      type: newQuestionType,
    }

    if (newQuestionType === "AVALIACAO") {
      question.maxScore = Number(valores)
    }

    if (newQuestionType === "CHECKBOX" || newQuestionType === "RADIO") {
      question.options = newOptions
    }

    if (newQuestionType === "LIST") {
      question.itens = newOptions
    }

    setQuestions((prev) => [...prev, question])
    resetNewQuestion()
    toast.success("Pergunta adicionada")
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error("Informe o nome do formulário.")
      return
    }

    if (questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta.")
      return
    }

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          userId: id,
          anonymous: true,
          cpf_list: [],
          questions: questions.map((q, index) => ({
            pergunta: q.text,
            type: q.type,
            itens:
              q.type === "LIST"
                ? q.itens || []
                : q.type === "CHECKBOX" || q.type === "RADIO"
                ? q.options || []
                : [],
            required: true,
            order: index,
          })),
        }),
      })

      if (!res.ok) {
        throw new Error("Erro ao salvar formulário")
      }

      await res.json()

      alert("Formulário salvo com sucesso")
      setFormName("")
      setQuestions([])
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar formulário")
    }
  }

  const renderTypeBadge = (type: QuestionType) => {
    switch (type) {
      case "TEXT":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <AlignLeft className="h-3 w-3" />
            Texto
          </Badge>
        )

      case "AVALIACAO":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Star className="h-3 w-3" />
            Avaliacao
          </Badge>
        )

      case "CHECKBOX":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <CheckSquare className="h-3 w-3" />
            Checkbox
          </Badge>
        )

      case "RADIO":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Circle className="h-3 w-3" />
            Radio
          </Badge>
        )

      case "LIST":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Circle className="h-3 w-3" />
            Lista
          </Badge>
        )
    }
  }

  return (
<div className="flex flex-col gap-6">

<Card>
<CardHeader>
<CardTitle>Informacoes do formulario</CardTitle>
<CardDescription>Defina o nome do formulario.</CardDescription>
</CardHeader>

<CardContent>
<div className="flex flex-col gap-2">
<Label>Nome do formulario *</Label>
<Input
value={formName}
onChange={(e) => setFormName(e.target.value)}
/>
</div>
</CardContent>
</Card>

<Card>
<CardHeader>

<div className="flex items-center justify-between">
<CardTitle>Perguntas</CardTitle>

{!isAddingQuestion && (
<Button
variant="outline"
size="sm"
onClick={() => setIsAddingQuestion(true)}
>
<Plus className="h-4 w-4 mr-2" />
Adicionar pergunta
</Button>
)}

</div>
</CardHeader>

<CardContent className="flex flex-col gap-4">

{questions.map((q, idx) => (
<div
key={q.id}
className="flex items-start gap-3 rounded-lg border p-4"
>

<div className="font-semibold">
{idx + 1}
</div>

<div className="flex-1">

<p className="text-sm font-medium">
{q.text}
</p>

<div className="mt-2 flex items-center gap-2 flex-wrap">

{renderTypeBadge(q.type)}

{q.type === "AVALIACAO" && q.maxScore && (
<Badge variant="outline" className="text-xs">
Nota max: {q.maxScore}
</Badge>
)}

{q.options?.map((opt, i) => (
<Badge key={i} variant="outline" className="text-xs">
{opt}
</Badge>
))}

{q.itens?.map((opt, i) => (
<Badge key={i} variant="outline" className="text-xs">
{opt}
</Badge>
))}

</div>
</div>

<Button
variant="ghost"
size="icon"
onClick={() => handleRemoveQuestion(q.id)}
>
<Trash2 className="h-4 w-4" />
</Button>

</div>
))}

{isAddingQuestion && (
<>

{questions.length > 0 && <Separator />}

<div className="border-dashed border p-4 rounded-lg">

<div className="flex flex-col gap-4">

<div>
<Label>Texto *</Label>
<Input
value={newQuestionText}
onChange={(e) => setNewQuestionText(e.target.value)}
/>
</div>

<div>
<Label>Tipo *</Label>

<Select
value={newQuestionType}
onValueChange={(v) =>
setNewQuestionType(v as QuestionType)
}
>

<SelectTrigger>
<SelectValue placeholder="Selecione" />
</SelectTrigger>

<SelectContent>

<SelectItem value="TEXT">
Texto
</SelectItem>

<SelectItem value="AVALIACAO">
Avaliacao
</SelectItem>

<SelectItem value="CHECKBOX">
Checkbox
</SelectItem>

<SelectItem value="RADIO">
Radio
</SelectItem>

<SelectItem value="LIST">
Lista
</SelectItem>

</SelectContent>
</Select>

</div>

{(
newQuestionType === "CHECKBOX" ||
newQuestionType === "RADIO" ||
newQuestionType === "LIST"
) && (

<div className="flex flex-col gap-2">

<Label>Opcoes *</Label>

<div className="flex gap-2">

<Input
value={newOptionText}
onChange={(e) =>
setNewOptionText(e.target.value)
}
placeholder="Digite uma opcao"
/>

<Button
size="sm"
type="button"
onClick={handleAddOption}
>
Adicionar
</Button>

</div>

<div className="flex gap-2 flex-wrap mt-2">

{newOptions.map((opt, idx) => (
<Badge
key={idx}
variant="secondary"
className="gap-1 text-xs cursor-pointer"
onClick={() =>
setNewOptions((prev) =>
prev.filter((_, i) => i !== idx)
)
}
>

{opt}
<Trash2 className="h-3 w-3" />

</Badge>
))}

</div>
</div>
)}

<div className="flex gap-2">

<Button
size="sm"
onClick={handleAddQuestion}
>
Adicionar
</Button>

<Button
variant="ghost"
size="sm"
onClick={resetNewQuestion}
>
Cancelar
</Button>

</div>

</div>
</div>
</>
)}

</CardContent>
</Card>

<div className="flex justify-end">

<Button
size="lg"
className="gap-2"
onClick={handleSubmit}
>

<Save className="h-4 w-4" />
{submitLabel}

</Button>

</div>

</div>
  )
}