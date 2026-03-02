"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Trash2 } from "lucide-react"
import { toast } from "sonner" // Importando toast para avisar que salvou

type Permissions = {
  dashboard: boolean
  feedbacks: boolean
  formularios: boolean
  logs: boolean
  supervisores: boolean
  relatorios: boolean
  podeCriarAdmin: boolean
}

type Admin = {
  id: string
  nome: string
  cpf: string
  status: "ativo" | "inativo"
  permissions: Permissions
}

export default function AdministracaoPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [novoAdmin, setNovoAdmin] = useState({
    nome: "",
    cpf: "",
    permissions: {
      dashboard: false,
      feedbacks: false,
      formularios: false,
      logs: false,
      supervisores: false,
      relatorios: false,
      podeCriarAdmin: false,
    },
  })

  // Carrega os admins ao abrir a página
  useEffect(() => {
    const salvo = localStorage.getItem("admins")
    if (salvo) {
      try {
        setAdmins(JSON.parse(salvo))
      } catch (e) {
        console.error("Erro ao carregar admins", e)
      }
    }
  }, [])

  function criarAdmin() {
    // Limpa o CPF de espaços ou pontos antes de salvar
    const cpfLimpo = novoAdmin.cpf.replace(/\D/g, "")

    if (!novoAdmin.nome || cpfLimpo.length !== 11) {
      toast.error("Por favor, preencha o nome e um CPF válido com 11 dígitos.")
      return
    }

    const admin: Admin = {
      id: Date.now().toString(),
      nome: novoAdmin.nome,
      cpf: cpfLimpo, // Salvamos o CPF limpo para o login funcionar sempre
      status: "ativo",
      permissions: novoAdmin.permissions,
    }

    // Atualiza o estado e salva NO MESMO MOMENTO no localStorage
    const listaAtualizada = [...admins, admin]
    setAdmins(listaAtualizada)
    localStorage.setItem("admins", JSON.stringify(listaAtualizada))

    // Limpa o formulário
    setNovoAdmin({
      nome: "",
      cpf: "",
      permissions: {
        dashboard: false,
        feedbacks: false,
        formularios: false,
        logs: false,
        supervisores: false,
        relatorios: false,
        podeCriarAdmin: false,
      },
    })
    
    toast.success("Administrador criado com sucesso!")
  }

  function excluir(id: string) {
    const listaFiltrada = admins.filter((a) => a.id !== id)
    setAdmins(listaFiltrada)
    localStorage.setItem("admins", JSON.stringify(listaFiltrada))
    toast.info("Administrador removido.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Administração</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nome Completo"
            value={novoAdmin.nome}
            onChange={(e) =>
              setNovoAdmin({ ...novoAdmin, nome: e.target.value })
            }
          />

          <Input
            placeholder="CPF (será o login)"
            value={novoAdmin.cpf}
            onChange={(e) =>
              setNovoAdmin({ ...novoAdmin, cpf: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            {Object.keys(novoAdmin.permissions).map((perm) => (
              <div key={perm} className="flex items-center gap-2">
                <Checkbox
                  id={perm}
                  checked={
                    novoAdmin.permissions[
                      perm as keyof Permissions
                    ]
                  }
                  onCheckedChange={(checked) =>
                    setNovoAdmin({
                      ...novoAdmin,
                      permissions: {
                        ...novoAdmin.permissions,
                        [perm]: Boolean(checked),
                      },
                    })
                  }
                />
                <label htmlFor={perm} className="text-sm capitalize cursor-pointer">
                  {perm.replace(/([A-Z])/g, ' $1').trim()}
                </label>
              </div>
            ))}
          </div>

          <Button onClick={criarAdmin} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
            Criar Administrador
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Administradores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.nome}</TableCell>
                  <TableCell>{admin.cpf}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => excluir(admin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {admins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                    Nenhum administrador criado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}