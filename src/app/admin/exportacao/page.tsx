'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

const MOCK_EVALUATIONS = [
  {
    id: '1',
    cpf: '12345678900',
    supervisor: 'Douglas',
    company: 'Dikma',
    date: '2026-03-15',
    averageRating: 4.5,
    status: 'Concluída',
  },
  {
    id: '2',
    cpf: '98765432100',
    supervisor: 'Maria Santos',
    company: 'ArcelorMittal',
    date: '2026-03-14',
    averageRating: 4.2,
    status: 'Concluída',
  },
  {
    id: '3',
    cpf: '55544433322',
    supervisor: 'João Silva',
    company: 'Dikma',
    date: '2026-03-13',
    averageRating: 4.8,
    status: 'Concluída',
  },
]

export default function ExportacaoPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [supervisorFilter, setSupervisorFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [cpfSearch, setCpfSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  const itemsPerPage = 10

  const supervisors = Array.from(new Set(MOCK_EVALUATIONS.map((e) => e.supervisor)))
  const companies = Array.from(new Set(MOCK_EVALUATIONS.map((e) => e.company)))

  const filteredEvaluations = useMemo(() => {
    return MOCK_EVALUATIONS.filter((evaluation) => {
      const evalDate = new Date(evaluation.date)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && evalDate < start) return false
      if (end && evalDate > end) return false
      if (supervisorFilter !== 'all' && evaluation.supervisor !== supervisorFilter) return false
      if (companyFilter !== 'all' && evaluation.company !== companyFilter) return false
      if (cpfSearch && !evaluation.cpf.includes(cpfSearch)) return false

      return true
    })
  }, [startDate, endDate, supervisorFilter, companyFilter, cpfSearch])

  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage)

  const paginatedEvaluations = filteredEvaluations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalEvaluations = filteredEvaluations.length

  const averageRating =
    filteredEvaluations.length > 0
      ? (
          filteredEvaluations.reduce((sum, e) => sum + e.averageRating, 0) /
          filteredEvaluations.length
        ).toFixed(1)
      : '0.0'

  const uniqueSupervisors = new Set(filteredEvaluations.map((e) => e.supervisor)).size

  const selectedPeriod =
    startDate && endDate ? `${startDate} a ${endDate}` : 'Não selecionado'

  const handleClearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSupervisorFilter('all')
    setCompanyFilter('all')
    setCpfSearch('')
    setCurrentPage(1)
  }

  const exportToExcel = async () => {
    setIsExporting(true)

    try {
      const ExcelJS = await import('exceljs')

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Relatório')

      worksheet.columns = [
        { header: 'CPF', key: 'cpf', width: 15 },
        { header: 'Supervisor', key: 'supervisor', width: 20 },
        { header: 'Empresa', key: 'company', width: 20 },
        { header: 'Data', key: 'date', width: 15 },
        { header: 'Nota', key: 'rating', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
      ]

      filteredEvaluations.forEach((e) => {
        const row = worksheet.addRow({
          cpf: e.cpf,
          supervisor: e.supervisor,
          company: e.company,
          date: e.date,
          rating: e.averageRating,
          status: e.status,
        })

        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.href = url
      link.download = 'relatorio-avaliacoes.xlsx'

      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }

    setIsExporting(false)
  }

  return (
    <div className="space-y-6 p-6">

      <h1 className="text-3xl font-bold">Exportação de Relatórios</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />

          <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />

          <Select value={supervisorFilter} onValueChange={setSupervisorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Supervisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {supervisors.map((s)=>(
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {companies.map((c)=>(
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleClearFilters} variant="outline">
            Limpar
          </Button>

        </CardContent>
      </Card>

      <Button onClick={exportToExcel} disabled={isExporting || filteredEvaluations.length===0}>
        <Download className="h-4 w-4 mr-2"/>
        Exportar Excel
      </Button>

      <Card>

        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>{totalEvaluations} avaliações</CardDescription>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>CPF</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {paginatedEvaluations.map((e)=>(
                <TableRow key={e.id}>
                  <TableCell>{e.cpf}</TableCell>
                  <TableCell>{e.supervisor}</TableCell>
                  <TableCell>{e.company}</TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.averageRating}</TableCell>
                  <TableCell>{e.status}</TableCell>
                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  )
}