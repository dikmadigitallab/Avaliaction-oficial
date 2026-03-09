"use client"

import { CheckCircle } from "lucide-react"

export default function AgradecimentoPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />

        <h1 className="text-3xl font-semibold">
          Obrigado pela sua resposta
        </h1>

        <p className="text-sm opacity-80">
          Suas informações foram enviadas com sucesso.  
          Agradecemos pelo tempo dedicado em responder.
        </p>

        <div className="pt-4">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium border transition hover:opacity-80"
            style={{
              borderColor: "var(--border)",
            }}
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}