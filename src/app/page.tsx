'use client'
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-500">
      <SiteHeader />

      <main className="flex-1">

        <section className="relative flex flex-col items-center justify-center gap-6 px-4 pt-28 pb-24 text-center overflow-hidden">

          <div className="absolute inset-0">
            <div
              style={{ backgroundImage: "url('/assets/felizes.avif')" }}
              className="absolute inset-0 bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          </div>

          {/* CONTEÚDO */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            <div className="relative hover:scale-105 transition-transform duration-300">
              <Image
                src="https://i.ibb.co/Z61BpdnN/download.png"
                alt="Dikma"
                width={140}
                height={50}
                priority
                className="brightness-110"
              />
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl uppercase">
              Avalie <span className="text-emerald-400">&</span> Action
            </h1>

            <p className="max-w-2xl text-lg text-white/80 font-medium">
              Plataforma de avaliação anônima para empresas que desejam fortalecer
              a cultura organizacional, ouvir colaboradores e transformar feedback
              em ação.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row mt-4">
              <a
                href="/login"
                className="rounded-xl bg-emerald-500 px-8 py-4 text-sm font-black uppercase text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30"
              >
                Acessar administração
              </a>

              <a
                href="#como-funciona"
                className="rounded-xl border-2 border-white/90 bg-transparent px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Como funciona
              </a>
            </div>

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
                  <h3 className="text-xl font-black uppercase mb-3 text-primary">
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
        <section className="relative border-t border-border-/40 px-4 py-28 text-center overflow-hidden bg-background">

          {/* background */}
          <div className="absolute inset-0">
            <div
                style={{ backgroundImage: "url('/assets/fundo.jpeg')" }}
                className="absolute inset-0 bg-cover bg-center scale-110 opacity-40"
            />

            {/* mantém cor padrão + leve profundidade */}
            <div className="absolute inset-0 bg-background/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_2%,rgba(0,0,0,0.3))]" />
          </div>

          {/* conteúdo */}
          <div className="relative z-10 mx-auto max-w-4xl space-y-8">
            <h2 className="text-3xl font-black uppercase">
              Benefícios <span className="text-emerald-500">Premium</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Cultura Organizacional",
                "Pontos Críticos",
                "Decisão por Dados",
                "Ambiente Transparente",
              ].map((b, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full border border-border bg-accent/10 text-xs font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
                >
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