"use client"

import { useState } from "react"
import { UserCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { FiSettings } from "react-icons/fi"

type Props = {
  nome?: string
  role?: string
}

export function CardUser({ nome, role }: Props) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const tipo = role || session?.user?.userType

  return (
    <>
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-6 w-6" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate">
              {nome || session?.user?.nome || "Usuário"}
            </span>
            <span className="text-xs text-muted-foreground uppercase">
              {tipo || "SEM PERFIL"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <FiSettings className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Configurações</span>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground"
              >
                Fechar
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              Modal em construção...
            </div>
          </div>
        </div>
      )}
    </>
  )
}