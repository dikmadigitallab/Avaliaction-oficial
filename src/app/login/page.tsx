"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setErro("Credenciais inválidas ou conta não encontrada.")
      setLoading(false)
      return
    }

    router.push("/admin/dashboard")
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden bg-background">
      
      {/* BACKGROUND COM OVERLAY DINÂMICO */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
          isFocused ? "scale-110 blur-[3px]" : "scale-100 blur-0"
        }`}
        style={{ backgroundImage: "url('/assets/fundo.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-brightness-75" />

      {/* CARD DE LOGIN */}
      <div className="relative z-10 w-full max-w-[400px] animate-scale-in">
        <div className="rounded-2xl border border-white/10 bg-background/70 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
          
          {/* LOGO E TÍTULO */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 p-3 rounded-2xl bg-primary/10 ring-1 ring-primary/20 animate-float">
               <Image
                src="https://i.ibb.co/Z61BpdnN/download.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto dark:brightness-0 dark:invert"
                unoptimized
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Acesso Restrito
            </h1>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-medium">
              Painel Administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* CAMPO EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 ml-1">
                E-mail
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="admin@exemplo.com"
                  className="h-12 w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 text-sm transition-all
                           focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>
            </div>

            {/* CAMPO SENHA */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 text-sm transition-all
                           focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>
            </div>

            {/* MENSAGEM DE ERRO */}
            {erro && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {erro}
              </div>
            )}

            {/* BOTÃO SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="relative h-12 w-full overflow-hidden rounded-xl bg-primary text-primary-foreground text-sm font-bold 
                         transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 group shadow-lg shadow-primary/20"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Entrar no Sistema"
                )}
              </div>
            </button>
          </form>

          {/* RODAPÉ DO CARD */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
              © 2024 Dikma Digital Lab. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}