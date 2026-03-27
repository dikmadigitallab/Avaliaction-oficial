"use client"

import { SiteHeader } from "@/components/site-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Lock,
  HelpCircle,
  Users,
  BarChart3,
  FileText,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "Meu CPF fica armazenado?",
    answer:
      "Nao. Seu CPF e processado por um algoritmo de criptografia (SHA-256) que gera um codigo unico e irreversivel. O CPF original nunca e salvo em nenhum lugar do sistema.",
  },
  {
    question: "O administrador pode saber quem eu sou?",
    answer:
      "Nao. O administrador visualiza apenas dados agregados como medias e comentarios, sem nenhuma informacao que identifique o avaliador.",
  },
  {
    question: "Posso avaliar mais de um supervisor?",
    answer:
      "Sim! Voce pode avaliar diferentes supervisores. Porem, so e permitida uma avaliacao por supervisor para evitar duplicatas.",
  },
  {
    question: "Posso alterar minha avaliacao depois de enviada?",
    answer:
      "Nao. Apos a confirmacao, a avaliacao e registrada de forma definitiva. Revise com atencao antes de enviar.",
  },
  {
    question: "Para que servem as avaliacoes?",
    answer:
      "As avaliacoes geram relatorios anonimos que ajudam as empresas a identificar pontos fortes e oportunidades de melhoria na gestao de equipes.",
  },
  {
    question: "Comentarios ofensivos sao permitidos?",
    answer:
      "Nao. O sistema possui um filtro automatico que bloqueia linguagem inapropriada. Seja construtivo em seus comentarios.",
  },
]

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        
        <div className="relative overflow-hidden">
          <div
            style={{ backgroundImage: "url('/assets/sobre.jpg')" }}
            className="absolute inset-0 bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10">
            <section className="mx-auto max-w-4xl px-4 pb-8 pt-10 text-center sm:pb-12 sm:pt-16 md:pt-20">
              <div className="mb-3 h-10 sm:h-12 flex justify-center">
                <Image
                  src="https://i.ibb.co/Z61BpdnN/download.png"
                  alt="Dikma"
                  width={120}
                  height={40}
                  className="h-10 w-auto sm:h-12"
                  priority
                  quality={100}
                />
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Sobre a plataforma
              </h1>
              <p className="mt-2 max-w-2xl mx-auto text-sm text-white/80 sm:text-base md:text-lg">
                Plataforma desenvolvida para impulsionar a melhoria contínua no ambiente de trabalho por meio de feedbacks anônimos.
              </p>
            </section>

            <section className="mx-auto max-w-4xl px-4 pb-8 sm:pb-12">
              <div className="grid gap-3 sm:gap-6 md:grid-cols-3">
                
                <Card className="bg-[#0B181C]/95 backdrop-blur-sm border-white/20 border">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white">Proposito</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/80">
                      Dar voz aos colaboradores de forma segura.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0B181C]/95 backdrop-blur-sm border-white/20 border">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white">Impacto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/80">
                      Relatorios anonimos ajudam na melhoria.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0B181C]/95 backdrop-blur-sm border-white/20 border">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white">Criterios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/80">
                      Lideranca, comunicacao e respeito.
                    </p>
                  </CardContent>
                </Card>

              </div>
            </section>
          </div>
        </div>

        <section className="border-y bg-card">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
            <div className="mb-6 text-center">
              <Lock className="mx-auto mb-2 h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold sm:text-2xl">
                Como funciona o anonimato
              </h2>
            </div>

            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              {[
                { step: "1", title: "Voce insere seu CPF", desc: "O CPF e utilizado apenas como entrada para o processo de anonimizacao." },
                { step: "2", title: "Geramos um codigo anonimo", desc: "Um algoritmo SHA-256 transforma o CPF em um codigo irreversivel" },
                { step: "3", title: "Avaliacao registrada", desc: "Sua avaliacao e salva vinculada apenas ao codigo anonimo, sem qualquer dado pessoal." },
                { step: "4", title: "Admin ve so dados agregados", desc: "O administrador tem acesso a medias, graficos e comentarios, nunca a dados de identificacao." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden">
          <div
            style={{ backgroundImage: "url('/assets/sobre.jpg')" }}
            className="absolute inset-0 bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10">
            <section className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
              <div className="mb-6 text-center">
                <HelpCircle className="mx-auto mb-2 h-5 w-5 text-white" />
                <h2 className="text-xl font-bold sm:text-2xl text-white">
                  Perguntas frequentes
                </h2>
              </div>

              <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                {faqs.map((faq) => (
                  <Card key={faq.question} className="bg-[#0B181C]/95 backdrop-blur-sm border-white/20 border">
                    <CardContent className="p-5">
                      <h3 className="mb-2 font-semibold text-white">{faq.question}</h3>
                      <p className="text-sm text-white/80">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="text-center pb-10">
          <Button asChild size="lg">
            <Link href="/">Fazer minha avaliacao</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}