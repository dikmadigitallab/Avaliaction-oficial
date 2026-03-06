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
    <main className="bg-[#EFF6F4] min-h-screen p-8 max-w-7xl mx-auto space-y-8 relative dark:bg-[#0B161A]">
      <button
        onClick={exportToExcel}
        className="absolute top-8 right-8 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        <Download size={18} />
        Exportar Excel
      </button>

      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Painel de Controle
        </h1>
        <p className="text-sm text-gray-600 mt-1 dark:text-gay-300">
          Métricas principais do sistema
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 ">
        <StatCard
          icon={<User size={24} />}
          label="Total de Admins"
          value={adminsCount}
          iconColor="bg-blue-500"
        />
        <StatCard
          icon={<Users size={24} />}
          label="Colaboradores"
          value={employeesCount}
          iconColor="bg-purple-500"
        />
        <StatCard
          icon={<UserCheck size={24} />}
          label="Supervisores"
          value={supervisorsCount}
          iconColor="bg-indigo-500"
        />
        <StatCard
          icon={<CheckSquare size={24} />}
          label="Avaliações"
          value={evaluationsCount}
          iconColor="bg-green-500"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Avaliação Média"
          value={avgEvaluation.toFixed(1)}
          iconColor="bg-yellow-400"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Avaliações por Dia
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={evaluationsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Distribuição de Notas
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 40]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          Avaliações Recentes
        </h2>

        <div className="overflow-x-auto dark:text-black">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-3 text-gray-600 text-sm">Supervisor</th>
                <th className="py-2 px-3 text-gray-600 text-sm">Empresa</th>
                <th className="py-2 px-3 text-gray-600 text-sm">Média</th>
                <th className="py-2 px-3 text-gray-600 text-sm">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentEvaluations.map((ev, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-2 px-3">{ev.supervisor}</td>
                  <td className="py-2 px-3">{ev.company}</td>
                  <td className="py-2 px-3">{ev.avgScore}</td>
                  <td className="py-2 px-3">{ev.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}