import Image from "next/image"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 px-4 pt-20 pb-16 text-center">
          <Image
            src="https://i.ibb.co/Z61BpdnN/download.png"
            alt="Dikma"
            width={140}
            height={50}
            priority
          />

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Avalie & Action
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            Plataforma de avaliação anônima para empresas que desejam fortalecer
            a cultura organizacional, ouvir colaboradores e transformar feedback
            em ação.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/admin/dashboard"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Acessar administração
            </a>

            <a
              href="#como-funciona"
              className="rounded-md border px-6 py-3 text-sm font-medium"
            >
              Como funciona
            </a>
          </div>
        </section>

        {/* Sobre */}
        <section
          id="como-funciona"
          className="border-t px-4 py-16 text-center"
        >
          <div className="mx-auto max-w-4xl space-y-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Como funciona
            </h2>

            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">
                  1. Criação de formulários
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gestores criam formulários personalizados com perguntas
                  objetivas ou abertas.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">
                  2. Coleta anônima
                </h3>
                <p className="text-sm text-muted-foreground">
                  Colaboradores respondem de forma segura, garantindo
                  confidencialidade.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">
                  3. Análise e ação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Resultados organizados permitem decisões baseadas em dados
                  reais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="border-t px-4 py-16 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Benefícios para a empresa
            </h2>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Fortalecimento da cultura organizacional</li>
              <li>• Identificação de pontos críticos internos</li>
              <li>• Tomada de decisão orientada por dados</li>
              <li>• Ambiente mais transparente e participativo</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>Dikma - Plataforma de avaliacao anonima de supervisores</p>
      </footer>
    </div>
  )
}