"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/context/AuthContext"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin } = useAuth()

  const isLoginPage = pathname === "/admin"

  useEffect(() => {
    if (!isLoginPage && !isAdmin) {
      router.replace("/admin")
    }
  }, [isAdmin, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground animate-pulse">
          Verificando acesso...
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}