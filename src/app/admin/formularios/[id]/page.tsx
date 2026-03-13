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
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Mail,
  MessageCircle,
  Save,
} from "lucide-react"
import { toast } from "sonner"

type Question = {
  id: string
  title: string
  type: string
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
  const [name, setName] = useState("")

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/details?id=${formId}`)
        if (!res.ok) throw new Error()

        const data = await res.json()

        setForm(data)
        setName(data.name)
      } catch {
        toast.error("Erro ao carregar formulario.")
      } finally {
        setLoading(false)
      }
    }

    if (formId) fetchForm()
  }, [formId])

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/forms?id=${formId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast.success("Formulario removido.")
      router.push("/admin/formularios")
    } catch {
      toast.error("Erro ao deletar formulario.")
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/forms?id=${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          anonymous: form?.anonymous,
        }),
      })

      if (!res.ok) throw new Error()

      const updated = await res.json()
      setForm(updated)
      setEditing(false)
      toast.success("Formulario atualizado.")
    } catch {
      toast.error("Erro ao atualizar formulario.")
    }
  }

  const buildLink = () => {
    return `${window.location.origin}/responder/${formId}`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildLink())
      toast.success("Link copiado.")
    } catch {
      toast.error("Erro ao copiar link.")
    }
  }

  const handleEmail = () => {
    const subject = encodeURIComponent("Formulario para resposta")
    const body = encodeURIComponent(
      `Responda o formulario pelo link:\n\n${buildLink()}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Responda o formulario:\n${buildLink()}`
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handlePreview = () => {
    window.open(`/admin/formularios/preview/${formId}`, "_blank")
  }

  if (loading) return <div>Carregando...</div>
  if (!form) return <div>Formulario nao encontrado.</div>

  return (
    <div className="space-y-6 max-w-4xl w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/admin/formularios")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {!editing ? (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          ) : (
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleUpdate}
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          )}

          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="w-full">
          {editing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full break-all"
            />
          ) : (
            <CardTitle className="text-xl break-all whitespace-normal leading-snug w-full">
              {form.name}
            </CardTitle>
          )}

          <CardDescription className="break-words">
            Criado em{" "}
            {new Date(form.createdAt).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <BarChart3 className="h-3 w-3" />
            0 respostas
          </Badge>

          <Badge variant="outline">
            {form.questions.length} perguntas
          </Badge>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Link de compartilhamento</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="border rounded-md p-3 text-sm break-all">
            {buildLink()}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              Copiar
            </Button>

            <Button variant="outline" className="gap-2" onClick={handleEmail}>
              <Mail className="h-4 w-4" />
              Email
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
              Previsualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Perguntas</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {form.questions.map((q, index) => (
            <div key={q.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="font-medium break-words w-full">
                  {index + 1}. {q.title}
                </span>

                {q.required && (
                  <Badge variant="outline">Obrigatoria</Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground break-words">
                Tipo: {q.type}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}