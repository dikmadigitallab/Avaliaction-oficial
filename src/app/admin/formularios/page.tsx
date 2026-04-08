"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
import { FormBuilder } from "@/components/form-builder"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardList,
  Star,
  AlignLeft,
  Copy,
  Mail,
  MessageCircle,
  ExternalLink,
  Trash2Icon,
  Eye,
} from "lucide-react"
import type { FormTemplate } from "@/lib/types"
import { toast } from "sonner"

export default function FormulariosPage() {
  const [forms, setForms] = useState<FormTemplate[]>([])
  const [deleteTarget, setDeleteTarget] = useState<FormTemplate | null>(null)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const id = session?.user?.id

  useEffect(() => {
    if (!id) return

    async function fetchForms() {
      try {
        const res = await fetch(`/api/forms?userId=${id}`)
        if (!res.ok) throw new Error()

        const data = await res.json()
        setForms(data)
      } catch {
        toast.error("Erro ao carregar formularios.")
      }
    }

    fetchForms()
  }, [id])

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
    const text = encodeURIComponent(`Responda o formulario pelo link:\n${url}`)
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handlePreview = (formId: string) => {
    window.open(`/admin/formularios/preview/${formId}`, "_blank")
  }

  const handleDelete = async (formId?: string) => {
    if (!formId) return

    try {
      const res = await fetch(`/api/forms?id=${formId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      setForms((prev) => prev.filter((form) => form.id !== formId))
      setDeleteTarget(null)

      toast.success("Formulario excluido.")
    } catch {
      toast.error("Erro ao excluir formulario.")
    }
  }

return (
    <div className="space-y-8 mt-12 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Formulários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus formulários de avaliação e acompanhe os resultados.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
          onClick={() => setOpen(true)}
        >
          Novo Form
        </motion.button>
      </div>

      {open && <FormBuilder />}

      {/* CONTENT SECTION */}
      {forms.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="p-4 rounded-full bg-background shadow-sm">
              <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">Nenhum formulário criado</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Crie seu primeiro formulário para começar a coletar avaliações.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((form) => {
              const ratingCount = form.questions.filter((q) => q.type === "avaliacao").length
              const textCount = form.questions.filter((q) => q.type === "texto").length

              return (
                <Card
                  key={form.id}
                  className="group relative flex flex-col justify-between overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-black/5"
                >
                  {/* Área clicável para navegação */}
                  <div 
                    className="absolute inset-0 cursor-pointer z-0" 
                    onClick={() => router.push(`/admin/formularios/${form.id}`)}
                  />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
                        <span className="line-clamp-1">{form.name}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                      </CardTitle>
                      <CardDescription className="text-[10px] uppercase tracking-wider font-semibold opacity-60">
                        Atualizado em {new Date(form.updatedAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
                        {form.questions.length} Questões
                      </Badge>
                      {ratingCount > 0 && (
                        <Badge variant="outline" className="gap-1 text-[10px] border-border/50 bg-background/50">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {ratingCount} Avaliação
                        </Badge>
                      )}
                    </div>

                    {/* ACTIONS ROW */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        {[
                          { icon: <Copy className="h-4 w-4" />, fn: handleCopyLink },
                          { icon: <Mail className="h-4 w-4" />, fn: handleShareEmail },
                          { icon: <MessageCircle className="h-4 w-4" />, fn: handleShareWhatsApp },
                          { icon: <Eye className="h-4 w-4" />, fn: handlePreview },
                        ].map((btn, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={(e) => { e.stopPropagation(); btn.fn(form.id); }}
                            >
                              {btn.icon}
                            </Button>
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteTarget(form)
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}

      {/* ALERT DIALOG REFINADO */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Excluir formulário?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Você está prestes a excluir <strong className="text-foreground break-all">{deleteTarget?.name}</strong>.
              Essa ação é permanente e removerá todos os dados vinculados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteTarget?.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Excluir permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}