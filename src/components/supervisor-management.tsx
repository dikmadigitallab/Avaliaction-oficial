

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  Search,
} from "lucide-react"
import { toast } from "sonner"

type UserType =
  | "EMPRESA"
  | "GERENTE"
  | "SUPERVISOR"
  | "ADMINISTRATOR"
  | "ADMIN"

interface User {
  id: string
  nome: string
  email: string
  cpf: string
  userType: UserType
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [newNome, setNewNome] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newCpf, setNewCpf] = useState("")
  const [newSenha, setNewSenha] = useState("")
  const [newType, setNewType] = useState<UserType>("GERENTE")

  const [editId, setEditId] = useState("")
  const [editNome, setEditNome] = useState("")

  const [deleteId, setDeleteId] = useState("")
  const [deleteNome, setDeleteNome] = useState("")


  const [editEmail, setEditEmail] = useState("")
const [editCpf, setEditCpf] = useState("")
const [editType, setEditType] = useState<UserType>("GERENTE")

  const refreshData = async () => {
    const res = await fetch("/api/create-user")
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    refreshData()
  }, [])

  const filtered = users
    .filter((u) =>
      filterType === "all" ? true : u.userType === filterType
    )
    .filter((u) =>
      searchTerm
        ? u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )

  const handleAdd = async () => {
    if (!newNome || !newEmail || !newCpf || !newSenha) {
      toast.error("Preencha todos os campos.")
      return
    }

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        body: JSON.stringify({
          nome: newNome,
          email: newEmail,
          cpf: newCpf,
          senha: newSenha,
          userType: newType,
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Usuário criado")
      setShowAddDialog(false)
      setNewNome("")
      setNewEmail("")
      setNewCpf("")
      setNewSenha("")
      refreshData()
    } catch {
      toast.error("Erro ao criar usuário")
    }
  }

const handleEdit = async (id: string) => {
  try {
    await fetch("/api/create-user", {
      method: "PUT",
      body: JSON.stringify({
        id,
        nome: editNome,
        email: editEmail,
        cpf: editCpf,
        userType: editType
      })
    })

    toast.success("Usuário atualizado")
    setEditId("")
    refreshData()
  } catch {
    toast.error("Erro ao atualizar")
  }
}

const handleDelete = async () => {
  const confirm = window.confirm(
    `Remover ${deleteNome}? Todos os dados relacionados também serão apagados.`
  )

  if (!confirm) return

  try {
    const res = await fetch(`/api/create-user?id=${deleteId}`, {
      method: "DELETE"
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Erro ao remover")
      return
    }

    toast.success("Usuário removido")
    setShowDeleteDialog(false)
    refreshData()
  } catch {
    toast.error("Erro ao remover")
  }
}

  return (
 <div className="mx-auto max-w-6xl px-3 py-6">
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold">Usuários</h1>
      <p className="text-sm text-muted-foreground">
        Gerenciamento de usuários da plataforma
      </p>
    </div>

    <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
      <UserPlus className="h-4 w-4" />
      Novo Usuário
    </Button>
  </div>

  <Card className="mb-6">
    <CardContent className="flex gap-3 p-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuário"
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Tipo de usuário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="EMPRESA">Empresa</SelectItem>
          <SelectItem value="GERENTE">Gerente</SelectItem>
          <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
          <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Lista de Usuários
        <Badge variant="secondary">{filtered.length}</Badge>
      </CardTitle>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {editId === u.id ? (
                  <Input
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="h-8"
                  />
                ) : (
                  u.nome
                )}
              </TableCell>

              <TableCell>
                {editId === u.id ? (
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-8"
                  />
                ) : (
                  u.email
                )}
              </TableCell>

              <TableCell>
                {editId === u.id ? (
                  <Input
                    value={editCpf}
                    onChange={(e) => setEditCpf(e.target.value)}
                    className="h-8"
                  />
                ) : (
                  u.cpf
                )}
              </TableCell>

              <TableCell>
                {editId === u.id ? (
                  <Select
                    value={editType}
                    onValueChange={(v) => setEditType(v as UserType)}
                  >
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPRESA">Empresa</SelectItem>
                      <SelectItem value="GERENTE">Gerente</SelectItem>
                      <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                      <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{u.userType}</Badge>
                )}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {editId === u.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(u.id)}
                      >
                        Salvar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditId("")}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditId(u.id)
                          setEditNome(u.nome)
                          setEditEmail(u.email)
                          setEditCpf(u.cpf)
                          setEditType(u.userType)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setDeleteId(u.id)
                          setDeleteNome(u.nome)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Usuário</DialogTitle>
        <DialogDescription>
          Criar novo usuário na plataforma
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Nome"
          value={newNome}
          onChange={(e) => setNewNome(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <Input
          placeholder="CPF"
          value={newCpf}
          onChange={(e) => setNewCpf(e.target.value)}
        />

        <Input
          placeholder="Senha"
          type="password"
          value={newSenha}
          onChange={(e) => setNewSenha(e.target.value)}
        />

        <Select value={newType} onValueChange={(v) => setNewType(v as UserType)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPRESA">Empresa</SelectItem>
            <SelectItem value="GERENTE">Gerente</SelectItem>
            <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
            <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
          Cancelar
        </Button>
        <Button onClick={handleAdd}>Criar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remover Usuário</DialogTitle>
        <DialogDescription>
          Remover <strong>{deleteNome}</strong>?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Remover
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  )
}