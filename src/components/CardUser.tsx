"use client"

import { UserCircle } from "lucide-react"

type Props = {
  nome: string
  role?: string
}

export function CardUser({ nome, role }: Props) {
  const tipo =
    role === "ADMIN" || role === "ADMINISTRATOR"
      ? "Admin"
      : "Gestor"

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserCircle className="h-6 w-6" />
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-semibold truncate">
          {nome || "Usuário"}
        </span>
        <span className="text-xs text-muted-foreground uppercase">
          {tipo}
        </span>
      </div>
    </div>
  )
}