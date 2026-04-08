"use client"

import React from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  User,
  Users,
  UserCheck,
  CheckSquare,
  TrendingUp,
  Download,
} from "lucide-react"

/* ================= MOCK DATA ================= */

const adminsCount = 0
const employeesCount = 0
const supervisorsCount = 1
const evaluationsCount = 1
const avgEvaluation = 5.0

const evaluationsByDay = [
  { day: "Seg", value: 65 },
  { day: "Ter", value: 78 },
  { day: "Qua", value: 72 },
  { day: "Qui", value: 85 },
  { day: "Sex", value: 92 },
  { day: "Sab", value: 45 },
  { day: "Dom", value: 38 },
]

const scoreDistribution = [
  { label: "Excelente (5)", value: 35 },
  { label: "Bom (4)", value: 28 },
  { label: "Normal (3)", value: 22 },
  { label: "Ruim (2)", value: 10 },
  { label: "Péssimo (1)", value: 6 },
]

const recentEvaluations = [
  {
    supervisor: "douglas-dikma",
    company: "dikma",
    avgScore: 5.0,
    date: "04/03/2026",
    Lideranca: 5,
    Comunicacao: 5,
    Respeito: 5,
    Organizacao: 5,
    ApoioEquipe: 5,
    Classificacao: "Ótimo",
    Comentario: "-",
  },
]

/* ================= EXPORTAÇÃO EXCEL PROFISSIONAL ================= */

async function exportToExcel() {
  const ExcelJS = (await import("exceljs")).default

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Dashboard")

  const exportDate = new Date()
  const exportDateFormatted = exportDate.toLocaleDateString("pt-BR")
  const exportTimeFormatted = exportDate.toLocaleTimeString("pt-BR")

  worksheet.mergeCells("A1:L1")
  const titleCell = worksheet.getCell("A1")
  titleCell.value = "Relatório Dashboard de Avaliações"
  titleCell.font = { bold: true, size: 14 }
  worksheet.getRow(1).height = 25

  worksheet.mergeCells("A2:L2")
  const subtitleCell = worksheet.getCell("A2")
  subtitleCell.value = `Plataforma Dikma | ${exportDateFormatted} às ${exportTimeFormatted}`
  subtitleCell.font = { size: 10 }
  worksheet.getRow(2).height = 18

  worksheet.getRow(3).height = 10

  const headers = [
    "Data",
    "Empresa",
    "Supervisor",
    "Liderança",
    "Comunicação",
    "Respeito",
    "Organização",
    "Apoio",
    "Média",
    "Classificação",
    "Comentário",
  ]

  const headerRow = worksheet.getRow(4)

  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10B981" },
    }
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
    cell.alignment = { horizontal: "center" }
  })

  worksheet.getRow(4).height = 20

  recentEvaluations.forEach((e, index) => {
    const row = worksheet.getRow(5 + index)

    const values = [
      e.date,
      e.company,
      e.supervisor,
      e.Lideranca,
      e.Comunicacao,
      e.Respeito,
      e.Organizacao,
      e.ApoioEquipe,
      e.avgScore,
      e.Classificacao,
      e.Comentario,
    ]

    values.forEach((value, i) => {
      const cell = row.getCell(i + 1)
      cell.value = value
      cell.alignment = { horizontal: "center" }
    })
  })

  worksheet.columns = [
    { width: 12 },
    { width: 16 },
    { width: 18 },
    { width: 12 },
    { width: 14 },
    { width: 12 },
    { width: 14 },
    { width: 12 },
    { width: 10 },
    { width: 16 },
    { width: 30 },
  ]

  const footerRow = 6 + recentEvaluations.length

  worksheet.mergeCells(`A${footerRow}:L${footerRow}`)
  const footerCell = worksheet.getCell(`A${footerRow}`)
  footerCell.value = `Total de avaliações: ${recentEvaluations.length} | Exportado em ${exportDateFormatted}`
  footerCell.font = { size: 9 }

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = `dashboard-avaliacoes-${exportDateFormatted.replace(
    /\//g,
    "-"
  )}.xlsx`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/* ================= CARD ================= */

function StatCard({
  icon,
  label,
  value,
  iconColor,
 
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  iconColor: string
  className: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
      <div
        className={`p-3 rounded-lg ${iconColor} text-white flex items-center justify-center`}
        style={{ minWidth: 48, minHeight: 48 }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

/* ================= DASHBOARD ================= */

export default function DashboardContent() {
 
return (
    <main className="min-h-screen p-6 md:p-8 space-y-8 bg-background animate-fade-in">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Painel de Controle
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Métricas principais do sistema
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm active:scale-95 group"
        >
          <Download size={18} className="group-hover:animate-float" />
          Exportar Excel
        </button>
      </div>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<User size={20} />}
          label="Total de Admins"
          value={adminsCount}
          className="border-l-4 border-l-blue-500"
          iconColor=""
        />
        <StatCard
          icon={<Users size={20} />}
          label="Colaboradores"
          value={employeesCount}
          className="border-l-4 border-l-purple-500"
           iconColor=""
        />
        <StatCard
          icon={<UserCheck size={20} />}
          label="Supervisores"
          value={supervisorsCount}
          className="border-l-4 border-l-indigo-500"
           iconColor=""
        />
        <StatCard
          icon={<CheckSquare size={20} />}
          label="Avaliações"
          value={evaluationsCount}
          className="border-l-4 border-l-green-500"
           iconColor=""
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Avaliação Média"
          value={avgEvaluation.toFixed(1)}
          className="border-l-4 border-l-yellow-400"
           iconColor=""
        />
      </section>

      {/* CHARTS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-bold text-card-foreground mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            Avaliações por Dia
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={evaluationsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-bold text-card-foreground mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-chart-2 rounded-full" />
            Distribuição de Notas
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={10}
                interval={0}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'var(--muted)', opacity: 0.4}} />
              <Bar dataKey="value" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* RECENT TABLE */}
      <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-card-foreground tracking-tight">
            Avaliações Recentes
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="py-4 px-6">Supervisor</th>
                <th className="py-4 px-6">Empresa</th>
                <th className="py-4 px-6 text-center">Média</th>
                <th className="py-4 px-6 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentEvaluations.map((ev, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  <td className="py-4 px-6 font-medium text-foreground">{ev.supervisor}</td>
                  <td className="py-4 px-6 text-muted-foreground">{ev.company}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                      {ev.avgScore}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-muted-foreground tabular-nums">{ev.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
);
  
}