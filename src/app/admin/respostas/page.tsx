'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Question = {
  id: string
  title: string
}

type Form = {
  id: string
  title: string
  createdAt: string
  userId: string
  questions: Question[]
}

export default function FormulariosPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userId = '1'
    if (!userId) {
      toast.error('Usuário não identificado')
      return
    }

    fetchForms(userId)
  }, [])

  const fetchForms = async (userId: string) => {
    try {
      const res = await fetch(`/api/forms?userId=${userId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setForms(data)
    } catch {
      toast.error('Erro ao carregar formulários')
    } finally {
      setLoading(false)
    }
  }

  const openForm = (formId: string) => {
    router.push(`/admin/respostas/${formId}`)
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Formulários</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Formulários criados por você
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Formulários</CardTitle>
          <CardDescription>{forms.length} formulário(s)</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Perguntas</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Carregando formulários...
                    </TableCell>
                  </TableRow>
                ) : forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum formulário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">
                        {form.title}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">
                          {form.questions.length} perguntas
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {new Date(form.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openForm(form.id)}
                          className="gap-1"
                        >
                          Ver respostas
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}