"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Heading,
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export type QuestionType =
  | "TEXT"
  | "AVALIACAO"
  | "CHECKBOX"
  | "RADIO"
  | "LIST"
  | "TITULO"

export interface FormQuestion {
  id: string
  text: string
  type: QuestionType
  required: boolean
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
  const router = useRouter()

  const [formName, setFormName] = useState(initialName)
  const [questions, setQuestions] = useState<FormQuestion[]>(initialQuestions)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)

  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | "">("")
  const [newRequired, setNewRequired] = useState(false)
  const [newOptions, setNewOptions] = useState<string[]>([])
  const [newOptionText, setNewOptionText] = useState("")

  const session = useSession()
  const id = session.data?.user?.id

  let questionNumber = 0

  const resetNewQuestion = () => {
    setNewQuestionText("")
    setNewQuestionType("")
    setNewRequired(false)
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
      toast.error("Informe o texto.")
      return
    }

    if (!newQuestionType) {
      toast.error("Selecione o tipo.")
      return
    }

    const question: FormQuestion = {
      id: crypto.randomUUID(),
      text: newQuestionText.trim(),
      type: newQuestionType,
      required: newQuestionType === "TITULO" ? false : newRequired,
    }

    if (newQuestionType === "AVALIACAO") {
      question.options = ["Ótimo", "Bom", "Regular", "Ruim"]
    }

    if (newQuestionType === "CHECKBOX" || newQuestionType === "RADIO") {
      if (newOptions.length === 0) {
        toast.error("Informe as opções.")
        return
      }
      question.options = newOptions
    }

    if (newQuestionType === "LIST") {
      if (newOptions.length === 0) {
        toast.error("Informe os itens da lista.")
        return
      }
      question.itens = newOptions
    }

    setQuestions((prev) => [...prev, question])
    resetNewQuestion()
    toast.success(newQuestionType === "TITULO" ? "Título adicionado" : "Pergunta adicionada")
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error("Informe o nome do formulário.")
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
          questions: questions.map((q, index) => ({
            pergunta: q.text,
            type: q.type,
            itens: q.type === "LIST" ? q.itens : (q.options || []),
            required: q.required,
            order: index,
          })),
        }),
      })

      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Formulário salvo com sucesso")
      router.push("/admin/formularios")
    } catch (error) {
      toast.error("Erro ao salvar formulário")
    }
  }

  const renderTypeBadge = (type: QuestionType) => {
    const badges = {
      TEXT: { label: "Texto", icon: AlignLeft },
      AVALIACAO: { label: "Avaliação", icon: Star },
      CHECKBOX: { label: "Checkbox", icon: CheckSquare },
      RADIO: { label: "Radio", icon: Circle },
      LIST: { label: "Lista", icon: Circle },
      TITULO: { label: "Título/Separador", icon: Heading },
    }
    const config = badges[type]
    const Icon = config.icon
    return (
      <Badge variant={type === "TITULO" ? "default" : "secondary"} className="gap-1 text-xs">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do formulário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label>Nome do formulário *</Label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estrutura do Formulário</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {questions.map((q) => {
            const isTitle = q.type === "TITULO"
            if (!isTitle) questionNumber++

            return (
              <div
                key={q.id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-all ${
                  isTitle 
                  ? "bg-muted/40 border-l-8 border-l-primary mt-6 mb-2 shadow-sm" 
                  : "bg-card"
                }`}
              >
                {!isTitle && <div className="font-semibold text-lg">{questionNumber}</div>}
                
                <div className="flex-1">
                  <p className={`break-words ${
                    isTitle 
                      ? "text-3xl font-black uppercase tracking-tight text-primary" // AQUI AUMENTA O TÍTULO
                      : "text-base font-medium"
                  }`}>
                    {q.text}
                  </p>
                  
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {renderTypeBadge(q.type)}
                    {!isTitle && (
                      <Badge variant={q.required ? "destructive" : "secondary"} className="text-[10px] uppercase">
                        {q.required ? "Obrigatória" : "Opcional"}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="icon" onClick={() => handleRemoveQuestion(q.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )
          })}

          {!isAddingQuestion && (
            <Button variant="outline" onClick={() => setIsAddingQuestion(true)} className="w-full h-12 border-dashed">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar item (Pergunta ou Título)
            </Button>
          )}

          {isAddingQuestion && (
            <div className="border-2 border-dashed p-6 rounded-xl bg-muted/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Texto do Título ou Pergunta *</Label>
                  <Input
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder={newQuestionType === "TITULO" ? "Ex: DADOS DA EMPRESA" : "Ex: Qual sua opinião?"}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Tipo de Item *</Label>
                  <Select
                    value={newQuestionType}
                    onValueChange={(v) => setNewQuestionType(v as QuestionType)}
                  >
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TITULO" className="font-bold text-primary italic">--- TÍTULO / SEPARADOR ---</SelectItem>
                      <SelectItem value="TEXT">Texto Livre</SelectItem>
                      <SelectItem value="AVALIACAO">Avaliação (Ótimo a Ruim)</SelectItem>
                      <SelectItem value="CHECKBOX">Múltipla Escolha (Checkbox)</SelectItem>
                      <SelectItem value="RADIO">Escolha Única (Radio)</SelectItem>
                      <SelectItem value="LIST">Lista de Seleção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newQuestionType !== "TITULO" && newQuestionType !== "" && (
                <div className="flex items-center gap-2 bg-background p-2 rounded-md border w-fit">
                  <input
                    type="checkbox"
                    id="req"
                    className="h-4 w-4 accent-primary"
                    checked={newRequired}
                    onChange={(e) => setNewRequired(e.target.checked)}
                  />
                  <Label htmlFor="req" className="cursor-pointer">Esta pergunta é obrigatória?</Label>
                </div>
              )}

              {["CHECKBOX", "RADIO", "LIST"].includes(newQuestionType as string) && (
                <div className="space-y-2 border-t pt-4">
                  <Label className="font-bold text-primary">Opções de resposta</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newOptionText}
                      onChange={(e) => setNewOptionText(e.target.value)}
                      placeholder="Adicione uma opção..."
                      onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                      className="bg-background"
                    />
                    <Button type="button" onClick={handleAddOption} variant="secondary">Adicionar</Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {newOptions.map((opt, idx) => (
                      <Badge key={idx} variant="outline" className="pl-3 pr-1 py-1 gap-2 bg-background">
                        {opt}
                        <Trash2 className="h-3 w-3 cursor-pointer text-destructive" onClick={() => setNewOptions(prev => prev.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleAddQuestion} className="flex-1">Adicionar ao Formulário</Button>
                <Button variant="ghost" onClick={resetNewQuestion}>Cancelar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pb-10">
        <Button size="lg" className="px-10 gap-2 shadow-lg" onClick={handleSubmit}>
          <Save className="h-5 w-5" />
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}