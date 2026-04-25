"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Mail,
  MessageCircle,
  Save,
  X,
  Plus,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

// Tipagem baseada no seu Model Prisma
type Question = {
  id: string
  pergunta: string
  type: "TEXT" | "AVALIACAO" | "CHECKBOX" | "RADIO" | "LIST" | "TITULO"
  required: boolean
  order: number
}

type FormType = {
  id: string
  name: string
  anonymous: boolean
  createdAt: string
  questions: Question[]
}

export default function FormViewPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params?.id as string

  const [form, setForm] = useState<FormType | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Estados de edição
  const [name, setName] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/details?id=${formId}`)
        if (!res.ok) throw new Error()

        const data = await res.json()
        setForm(data)
        
        // Inicializa os estados de edição com os dados que já existem no banco
        setName(data.name)
        setQuestions(data.questions || [])
      } catch {
        toast.error("Erro ao carregar formulário.")
      } finally {
        setLoading(false)
      }
    }

    if (formId) fetchForm()
  }, [formId])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/forms?id=${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          questions, // Envia o array completo de perguntas para sincronização
        }),
      })

      if (!res.ok) throw new Error()

      const updated = await res.json()
      setForm(updated)
      setEditing(false)
      toast.success("Alterações salvas com sucesso!")
    } catch {
      toast.error("Erro ao atualizar formulário.")
    } finally {
      setSaving(false)
    }
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    )
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      pergunta: "", // Começa vazio para o usuário digitar
      type: "TEXT",
      required: true,
      order: questions.length,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  // Funções auxiliares de compartilhamento
  const buildLink = () => typeof window !== "undefined" ? `${window.location.origin}/responder/${formId}` : ""
  
  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>
  if (!form) return <div className="p-10 text-center">Formulário não encontrado.</div>

  return (
    <div className="space-y-6 max-w-4xl w-full mx-auto p-4 pb-20">
      {/* HEADER DE AÇÕES */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-background/80 sticky top-0 z-10 py-2 backdrop-blur">
        <Button variant="ghost" onClick={() => router.push("/admin/formularios")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>

        <div className="flex items-center gap-2">
          {!editing ? (
            <Button onClick={() => setEditing(true)} className="gap-2">
              <Pencil className="h-4 w-4" /> Editar Formulário
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar Alterações
              </Button>
            </>
          )}
          <Button variant="destructive" size="icon" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CARD DO TÍTULO */}
      <Card>
        <CardHeader>
          {editing ? (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Título do Formulário</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="text-lg font-bold"
                placeholder="Ex: Pesquisa de Satisfação"
              />
            </div>
          ) : (
            <CardTitle className="text-2xl">{form.name}</CardTitle>
          )}
          <CardDescription>ID: {form.id}</CardDescription>
        </CardHeader>
      </Card>

      {/* ESTRUTURA DE PERGUNTAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold">Perguntas ({questions.length})</h3>
          {editing && (
            <Button onClick={addQuestion} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Nova Pergunta
            </Button>
          )}
        </div>

        {questions.map((q, index) => (
          <Card key={q.id} className={editing ? "border-primary/40 shadow-md" : ""}>
            <CardContent className="pt-6 space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Pergunta {index + 1}
                      </label>
                      <Input 
                        value={q.pergunta} // Aqui o valor antigo aparece para edição
                        onChange={(e) => updateQuestion(q.id, "pergunta", e.target.value)}
                        placeholder="Digite o enunciado da pergunta..."
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive mt-6" 
                      onClick={() => removeQuestion(q.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Tipo de Campo</label>
                      <Select 
                        value={q.type} 
                        onValueChange={(val: any) => updateQuestion(q.id, "type", val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEXT">Texto</SelectItem>
                          <SelectItem value="AVALIACAO">Avaliação (Estrelas)</SelectItem>
                          <SelectItem value="CHECKBOX">Múltipla Escolha</SelectItem>
                          <SelectItem value="RADIO">Seleção Única</SelectItem>
                          <SelectItem value="LIST">Lista Suspensa</SelectItem>
                          <SelectItem value="TITULO">Apenas Título/Seção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pt-8">
                      <Checkbox 
                        id={`req-${q.id}`} 
                        checked={q.required} 
                        onCheckedChange={(val) => updateQuestion(q.id, "required", !!val)}
                      />
                      <label htmlFor={`req-${q.id}`} className="text-sm font-medium cursor-pointer">
                        Resposta Obrigatória
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-lg">
                      <span className="text-muted-foreground mr-2">{index + 1}.</span>
                      {q.pergunta}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-[10px]">{q.type}</Badge>
                      {q.required && <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">Obrigatória</Badge>}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* COMPARTILHAMENTO (SÓ VISÍVEL SE NÃO ESTIVER EDITANDO) */}
      {!editing && (
        <Card className="bg-muted/30">
          <CardHeader><CardTitle className="text-base">Compartilhar</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
             <Button variant="outline" size="sm" onClick={() => {
               navigator.clipboard.writeText(buildLink());
               toast.success("Link copiado!");
             }}><Copy className="h-4 w-4 mr-2" /> Copiar Link</Button>
             <Button variant="outline" size="sm" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(buildLink())}`)}><MessageCircle className="h-4 w-4 mr-2" /> WhatsApp</Button>
          </CardContent>
        </Card>
      )}

      {/* MODAL DE DELETAR */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#06292b] rounded-xl p-6 w-full max-w-sm space-y-4 border shadow-2xl">
            <h2 className="text-lg font-semibold">Excluir Formulário?</h2>
            <p className="text-sm text-muted-foreground">Essa ação não pode ser desfeita e excluirá todas as respostas já recebidas.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={async () => {
                 await fetch(`/api/forms?id=${formId}`, { method: "DELETE" });
                 router.push("/admin/formularios");
              }}>Confirmar Exclusão</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}