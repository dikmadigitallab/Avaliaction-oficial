"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, ScatterChart, Scatter, ComposedChart,
} from "recharts"
import {
  FileText, Users, BarChart3, PieChart as PieChartIcon, Clock, Loader2,
  ChevronDown, MessageSquareText, ListChecks, Star, ArrowRight,
  CalendarDays, TrendingUp, Percent, LayoutDashboard, Search,
  Download, Share2, Maximize, Minimize, RefreshCw, Lightbulb,
  Gauge, Trophy, SmilePlus, MessageCircle, Timer,
  BarChartHorizontal, Calendar, TrendingUpDown, Cloud,
  Trash2, X, Sparkles, Calculator,
} from "lucide-react"
import { METRICAS_POR_TIPO } from "@/lib/metricas"
import type { QuestionType } from "@/lib/metricas"

const CORES = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899","#06b6d4","#84cc16","#f97316","#6366f1"]
const CORES_GRADIENTE = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]

interface DistribuicaoItem {
  opcao: string; quantidade: number; percentual: number
}
interface EvolucaoItem {
  dia: string; count: number; media: number
}
interface PeriodoItem {
  dia: string; quantidade: number
}
interface PalavraItem {
  palavra: string; quantidade: number
}
interface NuvemItem {
  palavra: string; quantidade: number; tamanho: number
}
interface RankingNota {
  nota: number; quantidade: number; percentual: number
}
interface CrescimentoItem {
  dia: string; count: number; variacao: number
}
interface HoraDistribuicao {
  hora: string; quantidade: number
}
interface UltimaResposta {
  id: string; valor: string; data: string
}

interface PerguntaData {
  id: string
  pergunta: string
  tipo: string
  order: number
  itens: string[]
  metricasSelecionadas: string[]
  totalRespondidos: number
  total_respostas?: { valor: number; label: string }
  total_respostas_valor?: number
  media_notas?: { valor: string; media: number; label: string }
  media_geral?: { valor: string; total: number; media: number }
  score_geral?: { valor: number; label: string; media: number }
  gauge?: { value: number; max: number; label: string }
  distribuicao?: DistribuicaoItem[]
  grafico_barras?: DistribuicaoItem[]
  grafico_barras_horizontais?: DistribuicaoItem[]
  grafico_pizza?: DistribuicaoItem[]
  grafico_donut?: DistribuicaoItem[]
  evolucao_diaria?: EvolucaoItem[]
  respostas_periodo?: PeriodoItem[]
  palavras_comuns?: PalavraItem[]
  nuvem_palavras?: NuvemItem[]
  ranking_notas?: RankingNota[]
  crescimento_diario?: CrescimentoItem[]
  crescimento_atual?: { valor: number; positivo: boolean; label: string }
  melhor_horario?: { distribuicao: HoraDistribuicao[]; pico: { hora: string; quantidade: number } | null }
  ultimas_respostas?: UltimaResposta[]
  tempo_medio_resposta?: { ms: number; segundos?: number; minutos?: number; label: string }
  sentimento_respostas?: { positivo: { valor: number; percentual: number }; neutro: { valor: number; percentual: number }; negativo: { valor: number; percentual: number }; dominante: string }
  tendencia?: { inclinacao: number; direcao: string }
  tendencia_respostas?: EvolucaoItem[]
  comparacao_periodos?: { periodo1: { total: number; media: number; label: string }; periodo2: { total: number; media: number; label: string }; variacao_total: number; variacao_media: number }
  insights?: string[]
}

interface DashboardData {
  formId: string; totalSubmissoes: number
  perguntas: PerguntaData[]
  datas: { primeira: string | null; ultima: string | null }
  insights?: string[]
  horaPico?: string | null
  diaPico?: string | null
}

const CustomTip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-xl text-xs backdrop-blur-sm">
      {label && <p className="font-semibold mb-1 text-foreground/80">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-foreground/70">{p.name || p.dataKey}: <strong className="text-foreground">{p.value}</strong></p>
      ))}
    </div>
  )
  return null
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/50 ${className}`} />
}

function KPICard({ icon: Icon, label, value, sub, color, trend }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string; trend?: { valor: number; positivo: boolean }
}) {
  return (
    <div className="group relative rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${color || "bg-primary/10 text-primary"} transition-all duration-300 group-hover:scale-110`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-2xl font-black tracking-tight">{value}</p>
            {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-bold ${trend.positivo ? "text-emerald-500" : "text-red-500"}`}>
            <TrendingUp className={`h-3.5 w-3.5 ${!trend.positivo ? "rotate-180" : ""}`} />
            {trend.valor.toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ children, title, icon: Icon, className = "" }: { children: React.ReactNode; title: string; icon?: any; className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-4 hover:shadow-md transition-all duration-300 ${className}`}>
      {title && (
        <div className="flex items-center gap-1.5 mb-3">
          {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
        </div>
      )}
      {children}
    </div>
  )
}

function GaugeChart({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const data = [{ name: "Score", value, fill: value > 80 ? "#10b981" : value > 60 ? "#f59e0b" : "#ef4444" }]
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={120}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={10} data={data} startAngle={180} endAngle={0}>
          <RadialBar background dataKey="value" cornerRadius={10} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-xl font-bold">
            {label || `${Math.round(value)}%`}
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

function MiniSparkline({ data, dataKey = "count", color = "#10b981" }: { data: any[]; dataKey?: string; color?: string }) {
  if (!data || data.length < 2) return null
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function MetricasPergunta({ pergunta, formId }: { pergunta: PerguntaData; formId: string }) {
  const metrics = pergunta.metricasSelecionadas
  if (metrics.length === 0) return null

  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      <div className="flex items-center gap-2 mb-2">
        <LayoutDashboard className="h-4 w-4 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Métricas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {metrics.includes("total_respostas") && pergunta.total_respostas && (
          <MetricCard title="Total de respostas" icon={Users}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600"><Users className="h-4 w-4" /></div>
              <p className="text-2xl font-black">{pergunta.total_respostas.valor}</p>
            </div>
            {pergunta.crescimento_atual && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${pergunta.crescimento_atual.positivo ? "text-emerald-500" : "text-red-500"}`}>
                <TrendingUp className={`h-3 w-3 ${!pergunta.crescimento_atual.positivo ? "rotate-180" : ""}`} />
                {pergunta.crescimento_atual.label} hoje
              </div>
            )}
          </MetricCard>
        )}

        {metrics.includes("media_notas") && pergunta.media_notas && (
          <MetricCard title="Média de notas" icon={Star}>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`h-5 w-5 ${s <= Math.round(pergunta.media_notas!.media) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-2xl font-black">{pergunta.media_notas.valor}</span>
            </div>
          </MetricCard>
        )}

        {metrics.includes("media_geral") && pergunta.media_geral && (
          <MetricCard title="Média geral" icon={Calculator}>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">{pergunta.media_geral.media.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">/ {pergunta.media_geral.total} respostas</span>
            </div>
          </MetricCard>
        )}

        {metrics.includes("score_geral") && pergunta.gauge && (
          <MetricCard title="Score geral" icon={Gauge}>
            <GaugeChart value={pergunta.gauge.value} max={pergunta.gauge.max} label={pergunta.gauge.label} />
          </MetricCard>
        )}

        {(metrics.includes("quantidade_opcao") || metrics.includes("porcentagem_resposta") || metrics.includes("porcentagem_opcao")) && pergunta.distribuicao && (
          <MetricCard title={metrics.includes("porcentagem_resposta") || metrics.includes("porcentagem_opcao") ? "Porcentagem por opção" : "Quantidade por opção"} icon={Percent}>
            <div className="space-y-2">
              {pergunta.distribuicao.slice(0, 6).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CORES[i % CORES.length] }} />
                  <span className="text-xs text-foreground flex-1 truncate">{d.opcao}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.percentual}%`, backgroundColor: CORES[i % CORES.length] }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-10 text-right">
                    {(metrics.includes("porcentagem_resposta") || metrics.includes("porcentagem_opcao")) ? `${d.percentual.toFixed(0)}%` : d.quantidade}
                  </span>
                </div>
              ))}
            </div>
          </MetricCard>
        )}

        {metrics.includes("grafico_barras") && pergunta.grafico_barras && pergunta.grafico_barras.length > 0 && (
          <MetricCard title="Gráfico de barras" icon={BarChart3} className="col-span-full sm:col-span-1">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pergunta.grafico_barras} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="opcao" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="quantidade" radius={[0, 4, 4, 0]} barSize={16}>
                  {pergunta.grafico_barras.map((_, i) => (<Cell key={i} fill={CORES[i % CORES.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("grafico_barras_horizontais") && pergunta.grafico_barras_horizontais && pergunta.grafico_barras_horizontais.length > 0 && (
          <MetricCard title="Barras horizontais" icon={BarChartHorizontal} className="col-span-full sm:col-span-1">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pergunta.grafico_barras_horizontais}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="opcao" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="quantidade" radius={[4, 4, 0, 0]} barSize={24}>
                  {pergunta.grafico_barras_horizontais.map((_, i) => (<Cell key={i} fill={CORES[i % CORES.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("grafico_pizza") && pergunta.grafico_pizza && pergunta.grafico_pizza.length > 0 && (
          <MetricCard title="Gráfico de pizza" icon={PieChartIcon} className="col-span-full sm:col-span-1">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pergunta.grafico_pizza} dataKey="quantidade" nameKey="opcao" cx="50%" cy="50%" outerRadius={70}
                  label={({ opcao, percentual }) => `${percentual.toFixed(0)}%`}>
                  {pergunta.grafico_pizza.map((_, i) => (<Cell key={i} fill={CORES[i % CORES.length]} />))}
                </Pie>
                <Tooltip content={<CustomTip />} />
              </PieChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("grafico_donut") && pergunta.grafico_donut && pergunta.grafico_donut.length > 0 && (
          <MetricCard title="Gráfico donut" icon={ChartPie} className="col-span-full sm:col-span-1">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pergunta.grafico_donut} dataKey="quantidade" nameKey="opcao" cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  label={({ opcao, percentual }) => `${percentual.toFixed(0)}%`}>
                  {pergunta.grafico_donut.map((_, i) => (<Cell key={i} fill={CORES[i % CORES.length]} />))}
                </Pie>
                <Tooltip content={<CustomTip />} />
              </PieChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("ranking") && pergunta.ranking_notas && (
          <MetricCard title="Ranking de notas" icon={Trophy}>
            <div className="space-y-2">
              {pergunta.ranking_notas.map((r) => (
                <div key={r.nota} className="flex items-center gap-2">
                  <div className="flex">{[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= r.nota ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${r.percentual}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground w-12 text-right">{r.percentual.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </MetricCard>
        )}

        {metrics.includes("ranking") && pergunta.distribuicao && !pergunta.ranking_notas && (
          <MetricCard title="Ranking" icon={Trophy}>
            <div className="space-y-1.5">
              {pergunta.distribuicao.slice(0, 6).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <span className="text-xs flex-1 truncate">{d.opcao}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{d.quantidade}</span>
                </div>
              ))}
            </div>
          </MetricCard>
        )}

        {metrics.includes("evolucao_diaria") && pergunta.evolucao_diaria && pergunta.evolucao_diaria.length > 0 && (
          <MetricCard title="Evolução diária" icon={TrendingUp} className="col-span-full">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={pergunta.evolucao_diaria}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Line type="monotone" dataKey="media" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("respostas_periodo") && pergunta.respostas_periodo && pergunta.respostas_periodo.length > 0 && (
          <MetricCard title="Respostas por período" icon={CalendarDays} className="col-span-full">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={pergunta.respostas_periodo}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Area type="monotone" dataKey="quantidade" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("crescimento_diario") && pergunta.crescimento_diario && pergunta.crescimento_diario.length > 0 && (
          <MetricCard title="Crescimento diário" icon={TrendingUp} className="col-span-full">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={pergunta.crescimento_diario}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="variacao" radius={[3, 3, 0, 0]} barSize={16}>
                  {pergunta.crescimento_diario.map((entry, i) => (
                    <Cell key={i} fill={entry.variacao >= 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("tendencia_respostas") && pergunta.tendencia_respostas && pergunta.tendencia_respostas.length > 0 && (
          <MetricCard title={`Tendência ${pergunta.tendencia?.direcao || ""}`} icon={TrendingUpDown} className="col-span-full">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={pergunta.tendencia_respostas}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("comparacao_periodos") && pergunta.comparacao_periodos && (
          <MetricCard title="Comparação entre períodos" icon={Calendar} className="col-span-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 border">
                <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Período 1</p>
                <p className="text-xs text-muted-foreground">{pergunta.comparacao_periodos.periodo1.label}</p>
                <p className="text-lg font-bold">{pergunta.comparacao_periodos.periodo1.total} respostas</p>
                <p className="text-xs text-muted-foreground">Média: {pergunta.comparacao_periodos.periodo1.media}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Período 2</p>
                <p className="text-xs text-muted-foreground">{pergunta.comparacao_periodos.periodo2.label}</p>
                <p className="text-lg font-bold">{pergunta.comparacao_periodos.periodo2.total} respostas</p>
                <p className="text-xs text-muted-foreground">Média: {pergunta.comparacao_periodos.periodo2.media}</p>
              </div>
            </div>
            {pergunta.comparacao_periodos.variacao_total !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${pergunta.comparacao_periodos.variacao_total > 0 ? "text-emerald-500" : "text-red-500"}`}>
                <TrendingUp className={`h-4 w-4 ${pergunta.comparacao_periodos.variacao_total < 0 ? "rotate-180" : ""}`} />
                {pergunta.comparacao_periodos.variacao_total > 0 ? "+" : ""}{pergunta.comparacao_periodos.variacao_total.toFixed(0)}% {pergunta.comparacao_periodos.variacao_total > 0 ? "mais" : "menos"} respostas
              </div>
            )}
          </MetricCard>
        )}

        {metrics.includes("melhor_horario") && pergunta.melhor_horario && (
          <MetricCard title="Melhor horário" icon={Clock} className="col-span-full sm:col-span-1">
            {pergunta.melhor_horario.pico && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Pico: {pergunta.melhor_horario.pico.hora} ({pergunta.melhor_horario.pico.quantidade} respostas)
                </span>
              </div>
            )}
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={pergunta.melhor_horario.distribuicao}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hora" stroke="var(--muted-foreground)" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="quantidade" radius={[2, 2, 0, 0]} barSize={12}>
                  {pergunta.melhor_horario.distribuicao.map((_, i) => (<Cell key={i} fill={CORES[i % CORES.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MetricCard>
        )}

        {metrics.includes("ultimas_respostas") && pergunta.ultimas_respostas && pergunta.ultimas_respostas.length > 0 && (
          <MetricCard title="Últimas respostas" icon={MessageCircle} className="col-span-full">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pergunta.ultimas_respostas.map((r) => (
                <div key={r.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20 border text-xs">
                  <MessageCircle className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{r.valor}</p>
                    <p className="text-[9px] text-muted-foreground">{new Date(r.data).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </MetricCard>
        )}

        {metrics.includes("tempo_medio_resposta") && pergunta.tempo_medio_resposta && (
          <MetricCard title="Tempo médio" icon={Timer}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Timer className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-black">{pergunta.tempo_medio_resposta.label}</p>
                <p className="text-[10px] text-muted-foreground">entre respostas</p>
              </div>
            </div>
          </MetricCard>
        )}

        {metrics.includes("palavras_comuns") && pergunta.palavras_comuns && pergunta.palavras_comuns.length > 0 && (
          <MetricCard title="Palavras mais usadas" icon={MessageSquareText} className="col-span-full">
            <div className="flex flex-wrap gap-2">
              {pergunta.palavras_comuns.slice(0, 20).map((p, i) => {
                const size = Math.max(11, Math.min(24, 11 + p.quantidade * 2))
                return (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-xs border transition-all hover:bg-primary/10 hover:border-primary/30 cursor-default"
                    style={{ fontSize: size, opacity: 0.6 + (p.quantidade / pergunta.palavras_comuns![0].quantidade) * 0.4 }}>
                    {p.palavra}
                  </span>
                )
              })}
            </div>
          </MetricCard>
        )}

        {metrics.includes("nuvem_palavras") && pergunta.nuvem_palavras && pergunta.nuvem_palavras.length > 0 && (
          <MetricCard title="Nuvem de palavras" icon={Cloud} className="col-span-full">
            <div className="flex flex-wrap gap-2 justify-center p-4">
              {pergunta.nuvem_palavras.slice(0, 30).map((p, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 transition-all hover:scale-110 cursor-default"
                  style={{
                    fontSize: `${10 + p.tamanho * 20}px`,
                    opacity: 0.5 + p.tamanho * 0.5,
                    color: CORES[i % CORES.length],
                  }}>
                  {p.palavra}
                </span>
              ))}
            </div>
          </MetricCard>
        )}

        {metrics.includes("sentimento_respostas") && pergunta.sentimento_respostas && (
          <MetricCard title="Sentimento das respostas" icon={SmilePlus} className="col-span-full sm:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pergunta.sentimento_respostas.positivo.percentual}%` }} />
                  <div className="h-full bg-gray-400 transition-all duration-500" style={{ width: `${pergunta.sentimento_respostas.neutro.percentual}%` }} />
                  <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${pergunta.sentimento_respostas.negativo.percentual}%` }} />
                </div>
              </div>
              {[
                { label: "Positivo", value: pergunta.sentimento_respostas.positivo, color: "text-emerald-500" },
                { label: "Neutro", value: pergunta.sentimento_respostas.neutro, color: "text-gray-400" },
                { label: "Negativo", value: pergunta.sentimento_respostas.negativo, color: "text-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className={item.color}>{item.label}</span>
                  <span className="font-mono">{item.value.valor} ({item.value.percentual.toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </MetricCard>
        )}

        {pergunta.insights && pergunta.insights.length > 0 && (
          <MetricCard title="Insights" icon={Lightbulb} className="col-span-full">
            <div className="space-y-2">
              {pergunta.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </MetricCard>
        )}
      </div>
    </div>
  )
}

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  TEXT: { label: "Texto", color: "text-blue-600 bg-blue-500/10" },
  AVALIACAO: { label: "Avaliação", color: "text-amber-600 bg-amber-500/10" },
  RADIO: { label: "Seleção Única", color: "text-emerald-600 bg-emerald-500/10" },
  CHECKBOX: { label: "Múltipla Escolha", color: "text-violet-600 bg-violet-500/10" },
  LIST: { label: "Lista Suspensa", color: "text-cyan-600 bg-cyan-500/10" },
  TITULO: { label: "Título", color: "text-gray-600 bg-gray-500/10" },
}

function TypeBadge({ type }: { type: QuestionType }) {
  const m = TYPE_MAP[type] || TYPE_MAP.TEXT
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.color}`}>{m.label}</span>
}

function ChartPie({ className }: { className?: string }) {
  return <PieChartIcon className={className} />
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [forms, setForms] = useState<{ id: string; name: string }[]>([])
  const [selectedFormId, setSelectedFormId] = useState("")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingForms, setLoadingForms] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [fullscreen, setFullscreen] = useState(false)
  const [filtroPeriodo, setFiltroPeriodo] = useState("7d")

  useEffect(() => {
    if (!userId) return
    fetch(`/api/forms?userId=${userId}`).then((r) => r.ok && r.json()).then((j) => setForms(j)).finally(() => setLoadingForms(false))
  }, [userId])

  useEffect(() => {
    if (!selectedFormId) { setData(null); return }
    setLoading(true)
    fetch(`/api/dashboard?formId=${selectedFormId}`).then((r) => r.ok && r.json()).then((j) => setData(j)).finally(() => setLoading(false))
  }, [selectedFormId])

  const selectedForm = forms.find((f) => f.id === selectedFormId)

  const filteredPerguntas = useMemo(() => {
    if (!data) return []
    if (!searchTerm.trim()) return data.perguntas
    return data.perguntas.filter((p) =>
      p.pergunta.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {})
    }
  }, [])

  const handleExport = useCallback(async (format: "pdf" | "excel") => {
    if (!selectedFormId) return
    try {
      const res = await fetch(`/api/dashboard?formId=${selectedFormId}`)
      const json = await res.json()
      if (format === "excel") {
        const XLSX = await import("xlsx")
        const wb = XLSX.utils.book_new()
        const rows = json.perguntas?.flatMap((p: any) =>
          (p.distribuicao || []).map((d: any) => ({
            Pergunta: p.pergunta,
            Opção: d.opcao,
            Quantidade: d.quantidade,
            Percentual: `${d.percentual.toFixed(1)}%`,
          }))
        ) || []
        if (rows.length === 0) rows.push({ Mensagem: "Nenhum dado disponível" })
        const ws = XLSX.utils.json_to_sheet(rows)
        XLSX.utils.book_append_sheet(wb, ws, "Dashboard")
        XLSX.writeFile(wb, `dashboard-${selectedFormId}.xlsx`)
      }
    } catch { /* ignore */ }
  }, [selectedFormId])

  const totalMetricasAtivas = data?.perguntas.reduce((a, p) => a + p.metricasSelecionadas.length, 0) || 0
  const totalInsights = data?.perguntas.reduce((a, p) => a + (p.insights?.length || 0), 0) || 0

  const mediaGeral = useMemo(() => {
    if (!data?.perguntas) return null
    const medias = data.perguntas
      .filter((p) => p.media_notas?.media)
      .map((p) => p.media_notas!.media)
    if (medias.length === 0) return null
    return medias.reduce((s, m) => s + m, 0) / medias.length
  }, [data])

  return (
    <div className={`space-y-6 animate-fade-in ${fullscreen ? "p-6" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Métricas personalizadas por pergunta.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text" placeholder="Buscar pergunta..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 lg:w-56 rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative">
            <select value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full min-w-[180px] appearance-none rounded-xl border border-input bg-background px-4 py-2 pr-10 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">{loadingForms ? "Carregando..." : "Selecione um formulário"}</option>
              {forms.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {selectedFormId && (
            <div className="flex items-center gap-1">
              <button onClick={() => handleExport("excel")} className="p-2 rounded-xl hover:bg-muted transition-colors" title="Exportar Excel">
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={toggleFullscreen} className="p-2 rounded-xl hover:bg-muted transition-colors" title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}>
                {fullscreen ? <Minimize className="h-4 w-4 text-muted-foreground" /> : <Maximize className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {!selectedFormId && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Selecione um formulário</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Escolha um formulário para ver as métricas.</p>
        </div>
      )}

      {selectedFormId && loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-12" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      )}

      {selectedFormId && !loading && !data && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Nenhum dado encontrado</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Este formulário ainda não tem respostas.</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <KPICard icon={Users} label="Total de Respostas" value={data.totalSubmissoes}
              color="bg-emerald-500/10 text-emerald-600" sub={selectedForm?.name} />
            <KPICard icon={BarChart3} label="Perguntas" value={data.perguntas.length}
              color="bg-amber-500/10 text-amber-600" sub="com métricas" />
            <KPICard icon={LayoutDashboard} label="Métricas Ativas" value={totalMetricasAtivas}
              color="bg-purple-500/10 text-purple-600" />
            <KPICard icon={Lightbulb} label="Insights" value={totalInsights}
              color="bg-amber-500/10 text-amber-600" sub="automáticos" />
            <KPICard icon={Gauge} label="Média Geral" value={mediaGeral ? mediaGeral.toFixed(1) : "—"}
              color="bg-blue-500/10 text-blue-600" sub={mediaGeral ? "/ 5" : "indisponível"} />
          </div>

          {data.insights && data.insights.length > 0 && (
            <div className="rounded-2xl border bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Insights automáticos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.insights.map((insight, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                    {insight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.datas.primeira && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/20 rounded-xl px-4 py-2.5 border">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Primeira: {new Date(data.datas.primeira).toLocaleDateString("pt-BR")}</span>
              {data.datas.ultima && (
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Última: {new Date(data.datas.ultima).toLocaleDateString("pt-BR")}</span>
              )}
              {data.horaPico && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Pico: {data.horaPico}h</span>}
              {data.diaPico && <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Melhor dia: {new Date(data.diaPico).toLocaleDateString("pt-BR")}</span>}
            </div>
          )}

          <div className="grid gap-4">
            {filteredPerguntas.map((pergunta) => {
              const expanded = expandedId === pergunta.id
              const hasMetrics = pergunta.metricasSelecionadas.length > 0
              return (
                <div key={pergunta.id} className="rounded-2xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                  <button onClick={() => setExpandedId(expanded ? null : pergunta.id)}
                    className="w-full text-left p-5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="bg-primary/10 text-primary font-extrabold text-xs px-2.5 py-1 rounded-lg shrink-0 mt-1 min-w-[24px] text-center">
                        {pergunta.order + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate">{pergunta.pergunta}</h3>
                          <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <TypeBadge type={pergunta.tipo as QuestionType} />
                          <span className="text-[10px] text-muted-foreground">{pergunta.totalRespondidos} resposta(s)</span>
                          {hasMetrics && (
                            <span className="text-[10px] text-primary flex items-center gap-1">
                              <LayoutDashboard className="h-3 w-3" /> {pergunta.metricasSelecionadas.length} métrica(s)
                            </span>
                          )}
                          {pergunta.insights && pergunta.insights.length > 0 && (
                            <span className="text-[10px] text-amber-500 flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" /> {pergunta.insights.length} insight(s)
                            </span>
                          )}
                        </div>
                        {!expanded && pergunta.distribuicao && pergunta.distribuicao.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {pergunta.distribuicao.slice(0, 4).map((d, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border bg-muted/20 truncate max-w-[120px]">
                                {d.opcao} {d.percentual.toFixed(0)}%
                              </span>
                            ))}
                            {pergunta.crescimento_atual && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${pergunta.crescimento_atual.positivo ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-red-600 bg-red-500/10 border-red-500/20"}`}>
                                <TrendingUp className={`h-3 w-3 ${!pergunta.crescimento_atual.positivo ? "rotate-180" : ""}`} />
                                {pergunta.crescimento_atual.label}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {expanded && (
                    <div className="px-5 pb-5">
                      {!hasMetrics ? (
                        <p className="text-sm text-muted-foreground italic">Nenhuma métrica selecionada para esta pergunta.</p>
                      ) : (
                        <MetricasPergunta pergunta={pergunta} formId={selectedFormId} />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredPerguntas.length === 0 && searchTerm && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma pergunta encontrada para "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
