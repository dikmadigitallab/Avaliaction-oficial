"use client"

import { useState } from "react"
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  FilePieChart, 
  Calendar, 
  ArrowLeft,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Progress } from "@/components/ui/progress"

const EXPORT_FORMATS = [
  { id: "excel", label: "Microsoft Excel", sub: ".xlsx", icon: TableIcon, color: "text-emerald-500" },
  { id: "pdf", label: "Documento PDF", sub: ".pdf", icon: FileText, color: "text-red-500" },
  { id: "csv", label: "Arquivo CSV", sub: ".csv", icon: FilePieChart, color: "text-blue-500" },
]

export default function ExportPage() {
  const [format, setFormat] = useState<string | null>(null)
  const [isexporting, setIsExporting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    // Simulação de geração de relatório pesado
    setTimeout(() => {
      setIsExporting(false)
      setIsDone(true)
      // Resetar após 3 segundos
      setTimeout(() => setIsDone(false), 3000)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-zinc-100 font-sans">
      <SiteHeader />

      <main className="mx-auto max-w-[800px] px-6 py-12 md:py-16">
        
        {/* VOLTAR */}
        <Button variant="ghost" className="mb-8 text-zinc-500 hover:text-white -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
        </Button>

        {/* HEADER */}
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white">Exportar Relatórios</h1>
          <p className="text-zinc-400 text-lg">Selecione o formato e o período para baixar os dados das avaliações.</p>
        </div>

        <div className="space-y-8">
          
          {/* FORMATO DO ARQUIVO */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">1. Formato do Arquivo</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {EXPORT_FORMATS.map((f) => {
                const isSelected = format === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-300",
                      isSelected 
                        ? "bg-zinc-900 border-primary shadow-lg shadow-primary/10" 
                        : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <f.icon className={cn("h-8 w-8 mb-3", isSelected ? f.color : "text-zinc-600")} />
                    <span className={cn("font-bold block", isSelected ? "text-white" : "text-zinc-400")}>{f.label}</span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase mt-1">{f.sub}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* PERÍODO (MOCKUP DE FILTRO) */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">2. Período dos Dados</label>
            <Card className="bg-zinc-900/40 border-zinc-800 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 w-full space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Data Inicial
                </span>
                <input type="date" className="w-full bg-zinc-800 border-none rounded-xl h-12 px-4 text-white outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="flex-1 w-full space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Data Final
                </span>
                <input type="date" className="w-full bg-zinc-800 border-none rounded-xl h-12 px-4 text-white outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </Card>
          </section>

          {/* BOTÃO DE AÇÃO */}
          <div className="pt-8 flex flex-col items-center gap-6">
            {isexporting && (
              <div className="w-full max-w-sm space-y-3 animate-in fade-in">
                <div className="flex justify-between text-[10px] font-black uppercase text-primary tracking-widest">
                  <span>Gerando Arquivo...</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-1.5 bg-zinc-900" />
              </div>
            )}

            <Button 
              size="lg"
              disabled={!format || isexporting || isDone}
              onClick={handleExport}
              className={cn(
                "h-20 px-12 rounded-[1.5rem] text-xl font-black uppercase italic tracking-tighter transition-all duration-500 w-full sm:w-auto",
                isDone ? "bg-emerald-500 hover:bg-emerald-500" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isexporting ? (
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              ) : isDone ? (
                <CheckCircle2 className="mr-3 h-6 w-6" />
              ) : (
                <Download className="mr-3 h-6 w-6 stroke-[3px]" />
              )}
              {isexporting ? "Processando" : isDone ? "Concluído" : "Gerar Exportação"}
            </Button>

            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] text-center">
              Os dados são exportados seguindo as normas de LGPD
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}