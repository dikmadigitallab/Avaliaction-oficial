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
  ClipboardList,
  Mail,
  ChevronRight,
} from "lucide-react"
import { clearAdminSession } from "@/lib/store"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CardUser } from "./CardUser"

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
      try {
        setUserData(JSON.parse(session))
      } catch {}
    }
  }, [])

  const handleLogout = () => {
    clearAdminSession()
    localStorage.removeItem("usuarioLogado")
    router.push("/")
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border-/50">
        <Image
          src="https://i.ibb.co/Z61BpdnN/download.png"
          alt="Logo"
          width={90}
          height={30}
          className="h-7 w-auto dark:brightness-0 dark:invert"
          unoptimized
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
          Menu Principal
        </p>

        {NAV_ITEMS.map((item) => {
          const isMestre = userData?.nome === "Administrador Mestre"
          const permissionValue = userData?.permissions?.[item.permission]
          const canShow = isMestre || permissionValue === true || permissionValue === undefined

          if (!canShow) return null

          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-3 w-3 opacity-40" />
            </Link>
          )
        })}
      </nav>

      {/* User Card + Logout */}
      <div className="mt-auto border-t border-sidebar-border p-4 space-y-3">
        
        <CardUser/>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-destructive"
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
      <aside className="hidden lg:flex lg:w-64">
        <div className="fixed inset-y-0 left-0 z-30 w-64">
          <SidebarContent />
        </div>
      </aside>


    </>
  )
}