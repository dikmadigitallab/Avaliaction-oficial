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
import * as XLSX from "xlsx"

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

/* ================= EXPORTAÇÃO EXCEL ================= */

function exportToExcel() {
  const wb = XLSX.utils.book_new()

  // DASHBOARD RESUMO
  const dashboardResumo = [
    ["Painel de Controle"],
    [],
    ["Total de Admins", adminsCount],
    ["Colaboradores", employeesCount],
    ["Supervisores", supervisorsCount],
    ["Avaliações", evaluationsCount],
    ["Avaliação Média", avgEvaluation.toFixed(1)],
  ]

  const dashboardWS = XLSX.utils.aoa_to_sheet(dashboardResumo)
  XLSX.utils.book_append_sheet(wb, dashboardWS, "Resumo Dashboard")

  // AVALIAÇÕES POR DIA
  const avaliacoesDiaWS = XLSX.utils.json_to_sheet(evaluationsByDay)
  XLSX.utils.book_append_sheet(wb, avaliacoesDiaWS, "Avaliacoes por Dia")

  // DISTRIBUIÇÃO DE NOTAS
  const distribuicaoWS = XLSX.utils.json_to_sheet(scoreDistribution)
  XLSX.utils.book_append_sheet(wb, distribuicaoWS, "Distribuicao de Notas")

  // AVALIAÇÕES DETALHADAS
  const detalhadoData = recentEvaluations.map((e) => ({
    Data: e.date,
    Empresa: e.company,
    Supervisor: e.supervisor,
    Lideranca: e.Lideranca,
    Comunicacao: e.Comunicacao,
    Respeito: e.Respeito,
    Organizacao: e.Organizacao,
    ApoioEquipe: e.ApoioEquipe,
    Media: e.avgScore,
    Classificacao: e.Classificacao,
    Comentario: e.Comentario,
  }))

  const detalhadoWS = XLSX.utils.json_to_sheet(detalhadoData)
  XLSX.utils.book_append_sheet(wb, detalhadoWS, "Avaliacoes Detalhadas")

  XLSX.writeFile(wb, "dashboard_relatorio.xlsx")
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
    <main className="bg-gray-50 min-h-screen p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* BOTÃO EXPORTAR */}
      <button
        onClick={exportToExcel}
        className="absolute top-8 right-8 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        <Download size={18} />
        Exportar Excel
      </button>

      {/* TÍTULO */}
      <section>
        <h1 className="text-2xl font-bold text-gray-900">
          Painel de Controle
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Métricas principais do sistema
        </p>
      </section>

      {/* CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
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

      {/* GRÁFICOS */}
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
              <XAxis dataKey="label" interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis domain={[0, 40]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* TABELA */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          Avaliações Recentes
        </h2>
        <div className="overflow-x-auto">
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
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
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