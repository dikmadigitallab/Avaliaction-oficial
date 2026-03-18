'use client'
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {


  alert('osdcar')
  alert ('andre')
 
  return (
    // bg-background garante que a página siga o tema (claro/escuro) definido no seu layout
    // Adicionamos dark:bg-[#020817] ou dark:bg-[#0C0C0E] para bater com o fundo da imagem
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-500">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 px-4 pt-20 pb-16 text-center">
          <div className="relative hover:scale-105 transition-transform duration-300">
            <Image
              src="https://i.ibb.co/Z61BpdnN/download.png"
              alt="Dikma"
              width={140}
              height={50}
              priority
              className="dark:brightness-110"
            />
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-6xl  uppercase">
            Avalie <span className="text-primary">&</span> Action
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground font-medium">
            Plataforma de avaliação anônima para empresas que desejam fortalecer
            a cultura organizacional, ouvir colaboradores e transformar feedback
            em ação.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row mt-4">
            <a
              href="/login"

              className="rounded-xl bg-primary px-8 py-4 text-sm font-black uppercase  text-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"

            >
              Acessar administração
            </a>

            <a
              href="#como-funciona"
              className="rounded-xl border-2 border-input bg-background px-8 py-4 text-sm font-bold hover:bg-accent transition-all"
            >
              Como funciona
            </a>
          </div>
        </section>

        {/* Sobre */}
        <section
          id="como-funciona"
          className="border-t border-border-/40 px-4 py-20 text-center bg-accent/5"
        >
          <div className="mx-auto max-w-5xl space-y-12">
            <h2 className="text-3xl font-black uppercase sm:text-4xl">
              Como funciona
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "1. Criação",
                  desc: "Gestores criam formulários personalizados com perguntas objetivas.",
                },
                {
                  step: "2. Coleta",
                  desc: "Colaboradores respondem de forma 100% anônima e segura.",
                },
                {
                  step: "3. Ação",
                  desc: "Resultados organizados permitem decisões baseadas em dados reais.",
                },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-card border border-border-/50 shadow-sm hover:border-primary/50 transition-colors">
                  <h3 className="text-xl font-black uppercase  mb-3 text-primary">
                    {item.step}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="border-t border-border-/40 px-4 py-20 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <h2 className="text-3xl font-black uppercase ">
              Benefícios <span className="text-primary">Premium</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Cultura Organizacional",
                "Pontos Críticos",
                "Decisão por Dados",
                "Ambiente Transparente",
              ].map((b, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-border bg-accent/10 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  • {b}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-/40 py-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
          Dikma © 2026 - Gestão de Feedback Inteligente
        </p>
      </footer>
    </div>
  )
}