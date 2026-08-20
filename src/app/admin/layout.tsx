"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Header } from "@/components/header"

// Lista ordenada por especificidade: a primeira rota que bater define o título.
const PAGE_META: { prefix: string; titulo: string; descricao: string }[] = [
  { prefix: "/admin/formularios/preview", titulo: "Prévia do Formulário", descricao: "Visualização do formulário antes de compartilhar." },
  { prefix: "/admin/formularios/", titulo: "Detalhes do Formulário", descricao: "Visualize e edite as perguntas deste formulário." },
  { prefix: "/admin/formularios", titulo: "Formulários", descricao: "Gerencie seus formulários de avaliação e acompanhe os resultados." },
  { prefix: "/admin/respostas/all", titulo: "Todas as Respostas", descricao: "Consulte todas as respostas recebidas." },
  { prefix: "/admin/respostas/", titulo: "Respostas do Formulário", descricao: "Veja as respostas enviadas para este formulário." },
  { prefix: "/admin/respostas", titulo: "Respostas", descricao: "Acompanhe as respostas dos seus formulários." },
  { prefix: "/admin/usuarios", titulo: "Usuários", descricao: "Gerencie os usuários do sistema." },
  { prefix: "/admin/exportacao", titulo: "Exportação", descricao: "Exporte os dados das suas avaliações." },
  { prefix: "/admin/relatorios", titulo: "Relatórios", descricao: "Gere relatórios detalhados das avaliações." },
  { prefix: "/admin/feedbacks", titulo: "Feedbacks", descricao: "Revise os feedbacks recebidos." },
  { prefix: "/admin/logs", titulo: "Logs de Acesso", descricao: "Registro de acesso ao sistema." },
  { prefix: "/admin/cpf", titulo: "CPFs Cadastrados", descricao: "Importação e listagem de CPFs." },
  { prefix: "/admin/colaboradores", titulo: "Colaboradores", descricao: "Gerencie os colaboradores." },
  { prefix: "/admin/administracao", titulo: "Administração", descricao: "Configurações administrativas do sistema." },
  { prefix: "/admin/dashboard", titulo: "Dashboard", descricao: "Painel de controle para avaliadores e administradores." },
  { prefix: "/admin", titulo: "Dashboard", descricao: "Painel de controle para avaliadores e administradores." },
]

function getPageMeta(pathname: string) {
  return PAGE_META.find((item) => pathname.startsWith(item.prefix)) ?? PAGE_META[PAGE_META.length - 1]
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const meta = getPageMeta(pathname)

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <Header
          titulo={meta.titulo}
          descrição={meta.descricao}
        />
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 mt-16">
          {children}
        </div>
      </main>
    </div>
  )
}