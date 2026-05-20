"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Trash2, Save, Star, AlignLeft, CheckSquare, Circle, Heading,
  Users, MessageSquareText, BarChart3, PieChart, TrendingUp,
  ListChecks, Percent, CalendarDays, LayoutDashboard,
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { METRICAS_POR_TIPO, buildItens, extractOptions, extractMetrics } from "@/lib/metricas"
import type { QuestionType } from "@/lib/metricas"

export interface FormQuestion {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[]
  itens?: string[]
  metricas?: string[]
}

const ICON_MAP: Record<string, React.ElementType> = {
  Users, MessageSquareText, BarChart3, PieChart, TrendingUp,
  ListChecks, Percent, CalendarDays, Star,
}

export function FormBuilder() {
  const router = useRouter()
  const session = useSession()
  const userId = session.data?.user?.id

  const [formName, setFormName] = useState("")
  const [questions, setQuestions] = useState<FormQuestion[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const [newText, setNewText] = useState("")
  const [newType, setNewType] = useState<QuestionType | "">("")
  const [newRequired, setNewRequired] = useState(false)
  const [newOptions, setNewOptions] = useState<string[]>([])
  const [newOptionInput, setNewOptionInput] = useState("")
  const [newMetricas, setNewMetricas] = useState<string[]>([])

  let questionNumber = 0

  const resetForm = () => {
    setNewText(""); setNewType(""); setNewRequired(false)
    setNewOptions([]); setNewOptionInput(""); setNewMetricas([]); setIsAdding(false)
  }

  const addOption = () => {
    if (!newOptionInput.trim()) return
    setNewOptions((p) => [...p, newOptionInput.trim()])
    setNewOptionInput("")
  }

  const toggleMetrica = (val: string) => {
    setNewMetricas((p) => p.includes(val) ? p.filter((v) => v !== val) : [...p, val])
  }

  const handleAdd = () => {
    if (!newText.trim()) { toast.error("Informe o texto."); return }
    if (!newType) { toast.error("Selecione o tipo."); return }
    if (["CHECKBOX", "RADIO", "LIST"].includes(newType) && newOptions.length === 0) {
      toast.error("Adicione pelo menos uma opção."); return
    }

    const question: FormQuestion = {
      id: crypto.randomUUID(),
      text: newText.trim(),
      type: newType,
      required: newType === "TITULO" ? false : newRequired,
      metricas: newType === "TITULO" ? [] : [...newMetricas],
    }

    if (newType === "AVALIACAO") question.options = ["Ótimo", "Bom", "Regular", "Ruim"]
    if (["CHECKBOX", "RADIO"].includes(newType)) question.options = newOptions
    if (newType === "LIST") question.itens = newOptions

    setQuestions((p) => [...p, question])
    resetForm()
    toast.success(newType === "TITULO" ? "Título adicionado" : "Pergunta adicionada")
  }

  const handleRemove = (id: string) => setQuestions((p) => p.filter((q) => q.id !== id))

  const handleSubmit = async () => {
    if (!formName.trim()) { toast.error("Informe o nome do formulário."); return }
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(), userId, anonymous: true,
          questions: questions.map((q, index) => {
            const base = q.type === "LIST" ? q.itens || [] : q.options || []
            return {
              pergunta: q.text, type: q.type,
              itens: buildItens(base, q.metricas || []),
              required: q.required, order: index,
            }
          }),
        }),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Formulário salvo com sucesso")
      router.push("/admin/formularios")
    } catch { toast.error("Erro ao salvar formulário") }
  }

  const metricasDisponiveis = newType && newType !== "TITULO" ? METRICAS_POR_TIPO[newType] : []

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader><CardTitle>Informações do formulário</CardTitle></CardHeader>
        <CardContent>
          <Label>Nome do formulário *</Label>
          <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Perguntas</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {questions.map((q) => {
            const isTitle = q.type === "TITULO"
            if (!isTitle) questionNumber++
            return (
              <div key={q.id} className={`flex items-start gap-3 rounded-lg border p-4 ${isTitle ? "bg-muted/40 border-l-8 border-l-primary" : "bg-card"}`}>
                {!isTitle && <span className="font-bold text-lg mt-0.5">{questionNumber}</span>}
                <div className="flex-1 min-w-0">
                  <p className={isTitle ? "text-3xl font-black uppercase tracking-tight text-primary" : "text-base font-medium"}>{q.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <TypeBadge type={q.type} />
                    {!isTitle && <Badge variant={q.required ? "destructive" : "secondary"} className="text-[10px]">{q.required ? "Obrigatória" : "Opcional"}</Badge>}
                    {(q.metricas || []).length > 0 && (
                      <Badge variant="default" className="text-[10px] gap-1 bg-primary/10 text-primary border border-primary/20">
                        <LayoutDashboard className="h-3 w-3" /> {q.metricas!.length} métrica(s)
                      </Badge>
                    )}
                  </div>
                  {(q.metricas || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {q.metricas!.map((m) => (
                        <span key={m} className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/5 text-primary/70 border border-primary/10">{m.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(q.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )
          })}

          {!isAdding && (
            <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full h-12 border-dashed">
              <Plus className="h-5 w-5 mr-2" /> Adicionar Pergunta ou Título
            </Button>
          )}

          {isAdding && (
            <div className="border-2 border-dashed p-6 rounded-xl bg-muted/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Texto *</Label>
                  <Input value={newText} onChange={(e) => setNewText(e.target.value)}
                    placeholder={newType === "TITULO" ? "Ex: DADOS DA EMPRESA" : "Ex: Qual sua opinião?"} />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Tipo *</Label>
                  <Select value={newType} onValueChange={(v) => { setNewType(v as QuestionType); setNewMetricas([]); setNewOptions([]) }}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TITULO" className="font-bold text-primary italic">--- TÍTULO / SEPARADOR ---</SelectItem>
                      <SelectItem value="TEXT">Texto Livre</SelectItem>
                      <SelectItem value="AVALIACAO">Avaliação (Ótimo a Ruim)</SelectItem>
                      <SelectItem value="CHECKBOX">Múltipla Escolha</SelectItem>
                      <SelectItem value="RADIO">Escolha Única</SelectItem>
                      <SelectItem value="LIST">Lista de Seleção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newType !== "" && newType !== "TITULO" && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newRequired} onChange={(e) => setNewRequired(e.target.checked)} className="accent-primary" />
                  Pergunta obrigatória
                </label>
              )}

              {["CHECKBOX", "RADIO", "LIST"].includes(newType) && (
                <div className="space-y-2 border-t pt-4">
                  <Label className="font-bold text-primary">Opções de resposta</Label>
                  <div className="flex gap-2">
                    <Input value={newOptionInput} onChange={(e) => setNewOptionInput(e.target.value)}
                      placeholder="Digite uma opção..." onKeyDown={(e) => e.key === 'Enter' && addOption()} />
                    <Button type="button" onClick={addOption} variant="secondary">Adicionar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newOptions.map((opt, idx) => (
                      <Badge key={idx} variant="outline" className="pl-3 pr-1 py-1 gap-2">
                        {opt}
                        <Trash2 className="h-3 w-3 cursor-pointer text-destructive" onClick={() => setNewOptions((p) => p.filter((_, i) => i !== idx))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {metricasDisponiveis.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <Label className="font-bold text-sm">Métricas do Dashboard</Label>
                    <span className="text-[10px] text-muted-foreground">(escolha quais métricas exibir no dashboard)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {metricasDisponiveis.map((met) => {
                      const Icon = ICON_MAP[met.icon] || LayoutDashboard
                      const selected = newMetricas.includes(met.value)
                      return (
                        <label key={met.value}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            selected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                          }`}>
                          <input type="checkbox" checked={selected} onChange={() => toggleMetrica(met.value)} className="mt-0.5 accent-primary" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="text-sm font-medium">{met.label}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{met.desc}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleAdd} className="flex-1">Adicionar</Button>
                <Button variant="ghost" onClick={resetForm}>Cancelar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pb-10">
        <Button size="lg" className="px-10 gap-2 shadow-lg" onClick={handleSubmit}>
          <Save className="h-5 w-5" /> Salvar formulário
        </Button>
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: QuestionType }) {
  const map: Record<QuestionType, { label: string; icon: React.ElementType }> = {
    TEXT: { label: "Texto", icon: AlignLeft },
    AVALIACAO: { label: "Avaliação", icon: Star },
    CHECKBOX: { label: "Checkbox", icon: CheckSquare },
    RADIO: { label: "Radio", icon: Circle },
    LIST: { label: "Lista", icon: Circle },
    TITULO: { label: "Título", icon: Heading },
  }
  const cfg = map[type]
  const Icon = cfg.icon
  return (
    <Badge variant={type === "TITULO" ? "default" : "secondary"} className="gap-1 text-xs">
      <Icon className="h-3 w-3" /> {cfg.label}
    </Badge>
  )
}
