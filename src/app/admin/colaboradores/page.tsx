"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Users, 
  Search, 
  FileDown, 
  ChevronRight, 
  User, 
  ArrowLeft, 
  Star, 
  Calendar,
  ShieldCheck,
  BarChart3,
  Mail,
  FilterX,
  MoreVertical
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// --- Tipagem ---
type Avaliacao = {
  id: string
  data: string
  nota: number
  comentario: string
  supervisorQueAvaliou: string
}

type Colaborador = {
  id: string
  nome: string
  cpf: string
  email: string
  supervisorFixo: string
  totalAvaliacoes: number
  mediaNota: number
  status: "Ativo" | "Em Revisão"
  avaliacoes: Avaliacao[]
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  useEffect(() => {
    const mockData: Colaborador[] = [
      {
        id: "1",
        nome: "Alan Ferreira",
        cpf: "123.456.789-00",
        email: "alan.ferreira@empresa.com.br",
        supervisorFixo: "Marcos Oliveira",
        totalAvaliacoes: 1240,
        mediaNota: 4.9,
        status: "Ativo",
        avaliacoes: [
          { id: "a1", data: "2026-03-02", nota: 5, comentario: "Execução impecável no projeto Alpha.", supervisorQueAvaliou: "Marcos Oliveira" },
          { id: "a2", data: "2026-03-01", nota: 4, comentario: "Bom desempenho constante.", supervisorQueAvaliou: "Clara Mendes" },
        ]
      },
      {
        id: "2",
        nome: "Beatriz Souza",
        cpf: "987.654.321-11",
        email: "beatriz.souza@empresa.com.br",
        supervisorFixo: "Clara Mendes",
        totalAvaliacoes: 850,
        mediaNota: 4.7,
        status: "Ativo",
        avaliacoes: [
          { id: "b1", data: "2026-03-02", nota: 5, comentario: "Liderança nata durante o plantão.", supervisorQueAvaliou: "Clara Mendes" },
        ]
      }
    ]
    setColaboradores(mockData)
  }, [])

  const filteredData = useMemo(() => {
    return colaboradores.filter(c => {
      const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm)
      const matchesDate = selectedDate === "" || c.avaliacoes.some(a => a.data === selectedDate)
      return matchesSearch && matchesDate
    })
  }, [searchTerm, colaboradores, selectedDate])

  const handleExport = (colab: Colaborador) => {
    toast.success(`Relatório de ${colab.nome} gerado.`)
  }

  return (
    // "bg-background" e "text-foreground" garantem que ele pegue o tema do seu Admin principal
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      {!selectedColaborador ? (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Equipe de Colaboradores</h1>
              <p className="text-muted-foreground mt-1">Gestão de performance e indicadores de talentos.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setSelectedDate(""); }}>
                 <FilterX className="h-4 w-4 mr-2" /> Resetar
               </Button>
               <Button size="sm" className="bg-primary text-primary-foreground">
                 <Users className="h-4 w-4 mr-2" /> Novo Cadastro
               </Button>
            </div>
          </div>

          {/* Filtros em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar por nome ou documento..." 
                className="pl-10 bg-card border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date"
                className="pl-10 bg-card border-border"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Tabela com visual Premium */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-4 font-semibold">Membro</TableHead>
                  <TableHead className="font-semibold text-center">Gestor Responsável</TableHead>
                  <TableHead className="font-semibold text-center">Score Global</TableHead>
                  <TableHead className="font-semibold text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((colab) => (
                  <TableRow 
                    key={colab.id} 
                    className="group cursor-pointer hover:bg-muted/30 transition-colors border-border"
                    onClick={() => setSelectedColaborador(colab)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                          {colab.nome.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{colab.nome}</div>
                          <div className="text-xs text-muted-foreground">{colab.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm font-mediun text-muted-foreground">
                      {colab.supervisorFixo}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-black">
                        <Star className="h-3 w-3 fill-current" />
                        {colab.mediaNota.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        /* Visão Detalhada */
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedColaborador(null)} className="gap-2">
              <ArrowLeft size={18} /> Voltar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport(selectedColaborador)}>
                <FileDown size={16} className="mr-2" /> Exportar Dados
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Lateral */}
            <Card className="bg-card border-border shadow-md overflow-hidden">
              <div className="h-32 bg-primary/10 flex items-center justify-center border-b border-border">
                <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg">
                  {selectedColaborador.nome.charAt(0)}
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold">{selectedColaborador.nome}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedColaborador.cpf}</p>
                
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-[10px]">{selectedColaborador.status}</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Gestor</span>
                    <span className="font-semibold">{selectedColaborador.supervisorFixo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conteúdo Principal */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                  <BarChart3 className="h-5 w-5 text-primary mb-2" />
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Avaliações Recebidas</p>
                  <p className="text-2xl font-bold">{selectedColaborador.totalAvaliacoes}</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Média Atual</p>
                  <p className="text-2xl font-bold text-emerald-500">{selectedColaborador.mediaNota}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl shadow-sm">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-bold uppercase tracking-wider">Histórico de Feedbacks</h3>
                </div>
                <div className="divide-y divide-border">
                  {selectedColaborador.avaliacoes.map((av) => (
                    <div key={av.id} className="p-5 hover:bg-muted/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">
                          {av.data}
                        </span>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                          {av.nota} <Star size={12} className="fill-current" />
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        "{av.comentario}"
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-3">
                        Avaliado por: {av.supervisorQueAvaliou}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}