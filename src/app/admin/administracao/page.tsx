"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Trash2, Settings2, UserPlus, Save, Fingerprint } from "lucide-react"
import { toast } from "sonner"

// MUDANÇA AQUI: O nome agora é 'administracao' para bater com o NAV_ITEMS do Sidebar
type Permissions = {
  dashboard: boolean
  feedbacks: boolean
  formularios: boolean
  logs: boolean
  supervisores: boolean
  relatorios: boolean
  administracao: boolean 
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
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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
      administracao: false, // Alterado aqui também
    },
  })

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

  const atualizarLocalStorage = (novaLista: Admin[]) => {
    setAdmins(novaLista)
    localStorage.setItem("admins", JSON.stringify(novaLista))
  }

  function criarAdmin() {
    const cpfLimpo = novoAdmin.cpf.replace(/\D/g, "")

    if (!novoAdmin.nome || cpfLimpo.length !== 11) {
      toast.error("Preencha o nome e um CPF válido (11 dígitos).")
      return
    }

    const admin: Admin = {
      id: Date.now().toString(),
      nome: novoAdmin.nome,
      cpf: cpfLimpo,
      status: "ativo",
      permissions: novoAdmin.permissions,
    }

    atualizarLocalStorage([...admins, admin])
    setNovoAdmin({
      nome: "",
      cpf: "",
      permissions: {
        dashboard: false, feedbacks: false, formularios: false,
        logs: false, supervisores: false, relatorios: false, administracao: false,
      },
    })
    toast.success("Administrador criado com sucesso!")
  }

  function abrirEdicao(admin: Admin) {
    setEditingAdmin({ ...admin })
    setIsSheetOpen(true)
  }

  function salvarEdicao() {
    if (!editingAdmin) return
    const novaLista = admins.map((a) => (a.id === editingAdmin.id ? editingAdmin : a))
    atualizarLocalStorage(novaLista)
    setIsSheetOpen(false)
    toast.success("Alterações salvas!")
  }

  function excluir(id: string) {
    const listaFiltrada = admins.filter((a) => a.id !== id)
    atualizarLocalStorage(listaFiltrada)
    toast.info("Administrador removido.")
  }

  return (
    <div className="space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
        </div>
        <p className="text-muted-foreground ml-11">Gerencie os níveis de acesso e novos usuários.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-600" />
              Novo Administrador
            </CardTitle>
            <CardDescription>Defina os dados e as permissões iniciais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Input
                placeholder="Nome Completo"
                value={novoAdmin.nome}
                onChange={(e) => setNovoAdmin({ ...novoAdmin, nome: e.target.value })}
              />
              <Input
                placeholder="CPF (apenas números)"
                value={novoAdmin.cpf}
                onChange={(e) => setNovoAdmin({ ...novoAdmin, cpf: e.target.value })}
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Módulos de Acesso</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(novoAdmin.permissions).map((perm) => (
                  <div key={perm} className="flex items-center gap-2 bg-background/50 p-2 rounded border border-border/40 hover:bg-background transition-colors">
                    <Checkbox
                      id={perm}
                      checked={novoAdmin.permissions[perm as keyof Permissions]}
                      onCheckedChange={(checked) =>
                        setNovoAdmin({
                          ...novoAdmin,
                          permissions: { ...novoAdmin.permissions, [perm]: !!checked },
                        })
                      }
                    />
                    <label htmlFor={perm} className="text-xs capitalize cursor-pointer font-medium select-none">
                      {perm === 'administracao' ? 'Gerenciar Admins' : perm.replace(/([A-Z])/g, ' $1')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={criarAdmin} className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all active:scale-95">
              Criar Administrador
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm overflow-hidden h-fit">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg">Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-medium">{admin.nome}</TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono">{admin.cpf}</TableCell>
                    <TableCell className="text-right pr-6 space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => abrirEdicao(admin)}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => excluir(admin.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {admins.length === 0 && (
              <div className="p-12 text-center text-muted-foreground italic">
                Nenhum administrador cadastrado.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-600" />
              Editar Acessos
            </SheetTitle>
            <SheetDescription>
              Modifique o nome e as permissões de <strong>{editingAdmin?.nome}</strong>.
            </SheetDescription>
          </SheetHeader>

          {editingAdmin && (
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Nome do Administrador</label>
                <Input
                  value={editingAdmin.nome}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, nome: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-muted-foreground" /> CPF: {editingAdmin.cpf}
                </label>
                <div className="grid gap-2 border rounded-lg p-4 bg-muted/10">
                  {Object.keys(editingAdmin.permissions).map((perm) => (
                    <div key={perm} className="flex items-center justify-between p-2 hover:bg-background rounded transition-colors">
                      <label htmlFor={`edit-${perm}`} className="text-sm font-medium capitalize cursor-pointer">
                        {perm === 'administracao' ? 'Gerenciar Admins' : perm.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <Checkbox
                        id={`edit-${perm}`}
                        checked={editingAdmin.permissions[perm as keyof Permissions]}
                        onCheckedChange={(checked) =>
                          setEditingAdmin({
                            ...editingAdmin,
                            permissions: { ...editingAdmin.permissions, [perm]: !!checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <SheetFooter>
            <Button onClick={salvarEdicao} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" /> Salvar Alterações
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}