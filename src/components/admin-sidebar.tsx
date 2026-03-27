"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  UserCircle,
  ClipboardList,
  Mail,
  ChevronRight,
} from "lucide-react"
import { clearAdminSession } from "@/lib/store"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/admin/formularios", label: "Formulários", icon: ClipboardList, permission: "formularios" },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, permission: "Usuários" },
  { href: "/admin/respostas", label: "Respostas", icon: Mail, permission: "Respostas" },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<{ nome: string; permissions: any } | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("usuarioLogado")
    if (session) {
      try { setUserData(JSON.parse(session)) } 
      catch (e) { console.error("Erro ao carregar sessão:", e) }
    }
  }, [])

  const handleLogout = () => {
    clearAdminSession()
    localStorage.removeItem("usuarioLogado")
    router.push("/")
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border/50">
        <Image
          src="https://i.ibb.co/Z61BpdnN/download.png"
          alt="Logo"
          width={90}
          height={30}
          className="h-7 w-auto dark:brightness-0 dark:invert transition-all hover:opacity-80"
          unoptimized
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
          Menu Principal
        </p>
        {NAV_ITEMS.map((item) => {
          const isMestre = userData?.nome === "Administrador Mestre"
          const permissionValue = userData?.permissions?.[item.permission]
          let canShow = isMestre || permissionValue === true || permissionValue === undefined

          if (!canShow) return null
          
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-4 bg-sidebar-primary rounded-r-full" />
              )}
              <ChevronRight className={cn(
                "h-3 w-3 opacity-0 transition-all -translate-x-2",
                !isActive && "group-hover:opacity-40 group-hover:translate-x-0"
              )} />
            </Link>
          )
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-auto border-t border-sidebar-border p-4 bg-sidebar-accent/20">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-background/50 border border-sidebar-border/50 shadow-sm mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/10 text-sidebar-primary ring-1 ring-sidebar-primary/20">
            <UserCircle className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold">
              {userData?.nome || "Usuário"}
            </p>
            <p className="text-[10px] opacity-60 truncate uppercase tracking-tighter">
              {userData?.nome === "Administrador Mestre" ? "Super Admin" : "Gestor"}
            </p>
          </div>
          <ThemeToggle className="h-8 w-8 opacity-70 hover:opacity-100" />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 h-9 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Aside */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0">
        <div className="fixed inset-y-0 left-0 z-30 w-64 shadow-xl shadow-black/5">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 lg:hidden">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-sidebar-border">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 border-none">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Image src="https://i.ibb.co/Z61BpdnN/download.png" alt="Logo" width={80} height={25} className="dark:invert" unoptimized />
        </div>
        <ThemeToggle />
      </div>
    </>
  )
}