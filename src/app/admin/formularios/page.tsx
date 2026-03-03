"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  ClipboardList,
  Star,
  AlignLeft,
  Copy,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react"
import type { FormTemplate } from "@/lib/types"
import { toast } from "sonner"

export default function FormulariosPage() {
  const [forms, setForms] = useState<FormTemplate[]>([])
  const [deleteTarget, setDeleteTarget] = useState<FormTemplate | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await fetch("/api/forms")
        if (!res.ok) throw new Error()
        const data = await res.json()
        setForms(data)
      } catch {
        toast.error("Erro ao carregar formularios.")
      }
    }

    fetchForms()
  }, [])

  const buildFormUrl = (formId: string) => {
    return `${window.location.origin}/responder/${formId}`
  }

  const handleCopyLink = (formId: string) => {
    const url = buildFormUrl(formId)
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copiado."))
      .catch(() => toast.error("Nao foi possivel copiar o link."))
  }

  const handleShareEmail = (formId: string) => {
    const url = buildFormUrl(formId)
    const subject = encodeURIComponent("Formulario para resposta")
    const body = encodeURIComponent(`Acesse o formulario pelo link:\n\n${url}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  const handleShareWhatsApp = (formId: string) => {
    const url = buildFormUrl(formId)
    const text = encodeURIComponent(
      `Responda o formulario pelo link:\n${url}`
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const res = await fetch(`/api/forms/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      setForms((prev) =>
        prev.filter((form) => form.id !== deleteTarget.id)
      )
      setDeleteTarget(null)
      toast.success("Formulario excluido.")
    } catch {
      toast.error("Erro ao excluir formulario.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Formularios</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus formularios de avaliacao.
        </p>
      </div>

      {forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum formulario criado
            </p>
            <p className="text-sm text-muted-foreground">
              Crie seu primeiro formulario para comecar a coletar avaliacoes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .map((form) => {
              const ratingCount = form.questions.filter(
                (q) => q.type === "avaliacao"
              ).length

              const textCount = form.questions.filter(
                (q) => q.type === "texto"
              ).length

              return (
                <Card
                  key={form.id}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary"
                  onClick={ ()=>{router.push(`/admin/formularios/${form.id}`)} }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate flex items-center gap-2">
                          {form.name}
                          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Criado em{" "}
                          {new Date(form.createdAt).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {form.questions.length} pergunta
                        {form.questions.length !== 1 ? "s" : ""}
                      </Badge>

                      {ratingCount > 0 && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Star className="h-3 w-3" />
                          {ratingCount} avaliacao
                        </Badge>
                      )}

                      {textCount > 0 && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <AlignLeft className="h-3 w-3" />
                          {textCount} texto
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyLink(form.id)
                        }}
                        title="Copiar link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShareEmail(form.id)
                        }}
                        title="Compartilhar por email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShareWhatsApp(form.id)
                        }}
                        title="Compartilhar no WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir formulario</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o formulario{" "}
              <strong>{deleteTarget?.name}</strong>? Esta acao nao pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}