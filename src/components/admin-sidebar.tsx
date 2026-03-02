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
  { href: "/admin/administracao", label: "Administração", icon: UserCircle, permission: "podeCriarAdmin" },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<{ nome: string; permissions: any } | null>(null)

  // Carrega os dados do usuário logado para aplicar as permissões
  useEffect(() => {
    const session = localStorage.getItem("usuarioLogado")
    if (session) {
      setUserData(JSON.parse(session))
    }
  }, [])

  const handleLogout = () => {
    clearAdminSession()
    localStorage.removeItem("usuarioLogado") // Limpa os dados do usuário ao sair
    router.push("/admin")
  }

  return (
    <div className="flex h-full flex-col bg-[oklch(0.20_0.04_240)] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Image
          src="https://i.ibb.co/Z61BpdnN/download.png"
          alt="Dikma"
          width={100}
          height={34}
          className="h-8 w-auto brightness-0 invert"
          unoptimized
        />
      </div>

      {/* Nav Dinâmica baseada em permissões */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          // Se for admin mestre ou tiver a permissão específica, mostra o item
          const hasPermission = userData?.permissions?.[item.permission] || userData?.nome === "Administrador Mestre"
          
          if (!hasPermission && userData) return null

          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
              <UserCircle className="h-5 w-5 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white/90">
                {userData?.nome || "Carregando..."}
              </p>
              <p className="text-xs text-white/50 truncate">
                {userData?.nome === "Administrador Mestre" ? "Sistema" : "Administrador"}
              </p>
            </div>
          </div>
          <ThemeToggle className="text-white/60 hover:bg-white/10 hover:text-white" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-white/60 hover:bg-white/10 hover:text-white"
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

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 [&>button]:hidden">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Image
            src="https://i.ibb.co/Z61BpdnN/download.png"
            alt="Dikma"
            width={80}
            height={27}
            className="h-6 w-auto"
            unoptimized
          />
        </div>
        <ThemeToggle />
      </div>
    </>
  )
}