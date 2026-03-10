"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  LogOut,
  Menu,
  UserCircle,
  ClipboardList,
  ShieldCheck,
  Airplay,
  Mail,
} from "lucide-react"
import { clearAdminSession } from "@/lib/store"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/admin/feedbacks", label: "Feedbacks", icon: MessageSquare, permission: "feedbacks" },
  { href: "/admin/formularios", label: "Formulários", icon: ClipboardList, permission: "formularios" },
  { href: "/admin/logs", label: "Logs de Acesso", icon: FileText, permission: "logs" },
  { href: "/admin/supervisores", label: "Supervisores", icon: Users, permission: "supervisores" },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3, permission: "relatorios" },
  { href: "/admin/administracao", label: "Administração", icon: ShieldCheck, permission: "administracao" },
  { href: "/admin/colaboradores", label: "Colaboradores", icon: Users, permission: "administracao" },
  { href: "/admin/exportacao", label: "Exportação", icon: Airplay, permission: "administracao" },
  { href: "/admin/respostas/70260ca3-faab-41ca-9203-a306f73b5c25", label: "Respostas", icon: Mail, permission: "Respostas" },
  { href: "/admin/cpf/", label: "CPF's Cadastrados", icon: Mail, permission: "CPF Cadastrados" },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<{ nome: string; permissions: any } | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("usuarioLogado")
    if (session) {
      try {
        setUserData(JSON.parse(session))
      } catch (e) {
        console.error("Erro ao carregar sessão:", e)
      }
    }
  }, [])

  const handleLogout = () => {
    clearAdminSession()
    localStorage.removeItem("usuarioLogado")
    router.push("/admin")
  }

  return (
    <div className="flex h-full flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 px-5 py-5">
        <Image
          src="https://i.ibb.co/Z61BpdnN/download.png"
          alt="Dikma"
          width={100}
          height={34}
          className="h-8 w-auto dark:brightness-0 dark:invert"
          unoptimized
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isMestre = userData?.nome === "Administrador Mestre"
          const permissionValue = userData?.permissions?.[item.permission]

          let canShow = false

          if (isMestre) {
            canShow = true
          } else if (item.permission === "administracao") {
            canShow = permissionValue === true
          } else {
            canShow = permissionValue === true || permissionValue === undefined
          }

          if (!canShow) return null

          const isActive = pathname === item.href

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-200 text-gray-900 dark:bg-white/15 dark:text-white"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-white/10 p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-800 dark:bg-white/15 dark:text-white">
              <UserCircle className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {userData?.nome || "Carregando..."}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/50 truncate">
                {userData?.nome === "Administrador Mestre" ? "Sistema" : "Administrador"}
              </p>
            </div>
          </div>

          <ThemeToggle className="text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white" />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:flex lg:w-60 lg:shrink-0">
        <div className="fixed inset-y-0 left-0 z-30 w-60">
          <SidebarContent />
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-60 p-0 [&>button]:hidden bg-gray-100 dark:bg-[oklch(0.20_0.04_240)] border-none"
            >
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <Image
            src="https://i.ibb.co/Z61BpdnN/download.png"
            alt="Dikma"
            width={80}
            height={27}
            className="h-6 w-auto dark:brightness-0 dark:invert"
            unoptimized
          />
        </div>

        <ThemeToggle />
      </div>
    </>
  )
}