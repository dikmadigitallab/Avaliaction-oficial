"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"


export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [blur, setBlur] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    setLoading(false)

    if (res?.error) {
      setErro("Credenciais inválidas")
      return
    }

    router.push("/admin/dashboard")
  }

  return (


    <div className="relative min-h-screen flex items-center justify-center px-4">

    {/* BACKGROUND (SÓ IMAGEM) */}
    <div
      style={{ backgroundImage: "url('/assets/fundo.jpg')" }}
      className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
        blur ? "blur-sm scale-105" : ""
      }`}
    />
  
    {/* CONTEÚDO (NÃO BORRA) */}
    <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-[rgba(8,8,8,0.77)] p-8 shadow-sm">
  
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Entrar
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesse sua conta
        </p>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-4">
  
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Email
          </label>
  
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setBlur(true)}
            onBlur={()=>{setBlur(false)}}
            className="h-11 rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
  
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Senha
          </label>
  
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={()=>setBlur(true)}
            onBlur={()=>{setBlur(false)}}
            className="h-11 rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
  
        {erro && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {erro}
          </div>
        )}
  
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-4 rounded-md bg-primary text-primary-foreground
           text-sm font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Entrando..." : "Entrar"}
        </button>
  
      </form>
    </div>
  </div>
  )
}