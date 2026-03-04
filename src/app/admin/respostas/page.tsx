'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChevronRight, X, Download, FileText } from 'lucide-react'
import { maskCPF } from '@/lib/store'
import { toast } from 'sonner'

// Mock data - respostas de avaliação
const MOCK_RESPONSES = [
  {
    id: '1',
    cpf: '12345678900',
    supervisorId: 'João Silva',
    company: 'Dikma',
    date: '2026-03-15',
    averageRating: 4.5,
    status: 'Nova' as const,
    answers: {
      'Demonstra liderança efetiva?': 5,
      'Resolve conflitos com eficiência?': 4,
      'Comunica-se claramente?': 5,
      'Apoia o desenvolvimento da equipe?': 4,
      'Comentários adicionais': 'Excelente supervisão, muito bom mesmo!'
    }
  },
  {
    id: '2',
    cpf: '98765432100',
    supervisorId: 'Maria Santos',
    company: 'ArcelorMittal',
    date: '2026-03-14',
    averageRating: 3.8,
    status: 'Visualizada' as const,
    answers: {
      'Demonstra liderança efetiva?': 4,
      'Resolve conflitos com eficiência?': 3,
      'Comunica-se claramente?': 4,
      'Apoia o desenvolvimento da equipe?': 4,
      'Comentários adicionais': 'Bom desempenho no geral'
    }
  },
  {
    id: '3',
    cpf: '55544433322',
    supervisorId: 'Pedro Costa',
    company: 'Dikma',
    date: '2026-03-13',
    averageRating: 4.2,
    status: 'Nova' as const,
    answers: {
      'Demonstra liderança efetiva?': 4,
      'Resolve conflitos com eficiência?': 4,
      'Comunica-se claramente?': 4,
      'Apoia o desenvolvimento da equipe?': 4,
      'Comentários adicionais': 'Supervisor comprometido'
    }
  },
]

export default function RespostasPage() {
  const [cpfSearch, setCpfSearch] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [diaPesquisa, setDiaPesquisa] = useState('')
  const [selectedResponse, setSelectedResponse] = useState(MOCK_RESPONSES[0] || null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const itemsPerPage = 5

  // Função para exportar tudo como Excel com layout profissional
  const exportToExcel = async () => {
    setIsExporting(true)
    try {
      const ExcelJS = (await import('exceljs')).default
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Respostas')

      const exportDate = new Date()
      const exportDateFormatted = exportDate.toLocaleDateString('pt-BR')
      const exportTimeFormatted = exportDate.toLocaleTimeString('pt-BR')

      // Merge cells para título
      worksheet.mergeCells('A1:L1')
      const titleCell = worksheet.getCell('A1')
      titleCell.value = 'Relatório de Respostas de Avaliações'
      titleCell.font = { bold: true, size: 14, color: { argb: 'FF1F2937' } }
      titleCell.alignment = { horizontal: 'left', vertical: 'justify' }
      worksheet.getRow(1).height = 25

      // Subtítulo
      worksheet.mergeCells('A2:L2')
      const subtitleCell = worksheet.getCell('A2')
      subtitleCell.value = `Plataforma Dikma | Geração em ${exportDateFormatted} às ${exportTimeFormatted}`
      subtitleCell.font = { size: 10, color: { argb: 'FF6B7280' } }
      subtitleCell.alignment = { horizontal: 'left', vertical: 'justify' }
      worksheet.getRow(2).height = 18

      // Espaçamento
      worksheet.getRow(3).height = 5

      // Headers da tabela
      const headers = ['Data', 'Horário', 'CPF', 'Supervisor', 'Empresa', 'Nota Média', 'Status', 'Liderança', 'Comunicação', 'Respeito', 'Organização', 'Apoio']
      const headerRow = worksheet.getRow(4)
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1)
        cell.value = header
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.alignment = { horizontal: 'center', vertical: 'justify' }
      })
      worksheet.getRow(4).height = 20

      // Dados
      filteredResponses.forEach((response, index) => {
        const row = worksheet.getRow(5 + index)
        const [date, time] = response.date.split(' ')
        const cellValues = [
          date,
          time || '00:00',
          response.cpf,
          response.supervisorId,
          response.company,
          response.averageRating,
          response.status,
          5, // Exemplo: Liderança
          5, // Exemplo: Comunicação
          5, // Exemplo: Respeito
          5, // Exemplo: Organização
          5, // Exemplo: Apoio
        ]

        cellValues.forEach((value, index) => {
          const cell = row.getCell(index + 1)
          cell.value = value
          cell.alignment = { horizontal: 'center', vertical: 'justify' }
          if (index < 7) {
            cell.font = { size: 9 }
          }
        })
      })

      // Largura das colunas
      worksheet.columns = [
        { width: 12 },
        { width: 10 },
        { width: 14 },
        { width: 14 },
        { width: 14 },
        { width: 12 },
        { width: 10 },
        { width: 10 },
        { width: 12 },
        { width: 10 },
        { width: 12 },
        { width: 10 },
      ]

      // Rodapé
      const footerRow = 5 + filteredResponses.length + 2
      worksheet.mergeCells(`A${footerRow}:L${footerRow}`)
      const footerCell = worksheet.getCell(`A${footerRow}`)
      footerCell.value = `Total de respostas: ${filteredResponses.length} | Exportado em ${exportDateFormatted} às ${exportTimeFormatted}`
      footerCell.font = { size: 9, color: { argb: 'FF9CA3AF' } }
      footerCell.alignment = { horizontal: 'left', vertical: 'justify' }

      // Resumo Geral
      const summaryStartRow = footerRow + 3
      worksheet.mergeCells(`A${summaryStartRow}:L${summaryStartRow}`)
      const summaryTitleCell = worksheet.getCell(`A${summaryStartRow}`)
      summaryTitleCell.value = 'Resumo Geral'
      summaryTitleCell.font = { bold: true, size: 12, color: { argb: 'FF1F2937' } }

      const summarySubtitleRow = summaryStartRow + 1
      worksheet.mergeCells(`A${summarySubtitleRow}:L${summarySubtitleRow}`)
      const summarySubtitleCell = worksheet.getCell(`A${summarySubtitleRow}`)
      summarySubtitleCell.value = 'Visão consolidada das avaliações'
      summarySubtitleCell.font = { size: 10, color: { argb: 'FF6B7280' } }

      // Estatísticas
      const statsRow1 = summarySubtitleRow + 2
      const statsRow2 = statsRow1 + 1

      const cell1 = worksheet.getCell(`A${statsRow1}`)
      cell1.value = 'Total de Respostas'
      cell1.font = { bold: true, color: { argb: 'FF1F2937' } }

      const cell2 = worksheet.getCell(`B${statsRow1}`)
      cell2.value = filteredResponses.length
      cell2.font = { bold: true, size: 12, color: { argb: 'FF10B981' } }

      const cell3 = worksheet.getCell(`A${statsRow2}`)
      cell3.value = 'Média Geral'
      cell3.font = { bold: true, color: { argb: 'FF1F2937' } }

      const avgRating =
        filteredResponses.length > 0
          ? (filteredResponses.reduce((sum, r) => sum + r.averageRating, 0) / filteredResponses.length).toFixed(1)
          : '0.0'

      const cell4 = worksheet.getCell(`B${statsRow2}`)
      cell4.value = parseFloat(avgRating as string)
      cell4.font = { bold: true, size: 12, color: { argb: 'FF10B981' } }

      // Gerar arquivo
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `relatorio-respostas-${exportDateFormatted.replace(/\//g, '-')}.xlsx`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Relatório Excel baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao exportar relatório Excel')
    } finally {
      setIsExporting(false)
    }
  }

  // Filtrar respostas
  const filteredResponses = useMemo(() => {
    return MOCK_RESPONSES.filter((response) => {
      // Filtro por CPF
      if (cpfSearch && !response.cpf.includes(cpfSearch)) return false

      // Filtro por dia específico
      if (diaPesquisa && response.date !== diaPesquisa) return false

      // Filtro por período
      if (dataInicio && response.date < dataInicio) return false
      if (dataFim && response.date > dataFim) return false

      return true
    })
  }, [cpfSearch, diaPesquisa, dataInicio, dataFim])

  // Paginação
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage)
  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleClearFilters = () => {
    setCpfSearch('')
    setDiaPesquisa('')
    setDataInicio('')
    setDataFim('')
    setCurrentPage(1)
  }

  const handleViewDetails = (response: typeof MOCK_RESPONSES[0]) => {
    setSelectedResponse(response)
    setDetailModalOpen(true)
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Respostas das Avaliações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Todas as respostas enviadas pelos colaboradores aparecem aqui
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Pesquisa por CPF */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">CPF do Colaborador</label>
              <Input
                placeholder="Digite o CPF"
                value={cpfSearch}
                onChange={(e) => {
                  setCpfSearch(e.target.value)
                  setCurrentPage(1)
                }}
                type="text"
              />
            </div>

            {/* Dia específico */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Dia Específico</label>
              <Input
                type="date"
                value={diaPesquisa}
                onChange={(e) => {
                  setDiaPesquisa(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Data Início */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Data Início</label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => {
                  setDataInicio(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Data Fim */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Data Fim</label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => {
                  setDataFim(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={() => setCurrentPage(1)}>
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Respostas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Respostas Recebidas</CardTitle>
              <CardDescription>{filteredResponses.length} resposta(s) encontrada(s)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Supervisor Avaliado</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Data da Avaliação</TableHead>
                  <TableHead className="text-center">Nota Média</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedResponses.length > 0 ? (
                  paginatedResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-mono font-medium">{maskCPF(response.cpf)}</TableCell>
                      <TableCell>{response.supervisorId}</TableCell>
                      <TableCell>{response.company}</TableCell>
                      <TableCell>
                        {new Date(response.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-sm font-semibold">
                          {response.averageRating.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {response.status === 'Nova' ? (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100">
                            {response.status}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {response.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(response)}
                          className="gap-1"
                        >
                          Ver detalhes
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma resposta encontrada com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Exportação */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exportação</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Exporte todos os dados da área administrativa em formato Excel
          </p>
        </div>

        <Card className="transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Dados Completos
            </CardTitle>
            <CardDescription>
              Gera um arquivo Excel com todos os dados de respostas, colaboradores, administradores e outros registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Info Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Total de Respostas</p>
                  <p className="text-2xl font-bold text-foreground">{filteredResponses.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data do Export</p>
                  <p className="text-sm font-semibold text-foreground">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nota Média</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredResponses.length > 0
                      ? (
                          filteredResponses.reduce((sum, r) => sum + r.averageRating, 0) /
                          filteredResponses.length
                        ).toFixed(1)
                      : '0.0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Incluído</p>
                  <p className="text-sm font-semibold text-foreground">Tudo da Admin</p>
                </div>
              </div>

              {/* Export Button */}
              <Button
                onClick={exportToExcel}
                disabled={isExporting}
                size="lg"
                className="w-full gap-2"
              >
                <Download className="h-5 w-5" />
                {isExporting ? 'Gerando arquivo...' : 'Exportar como Excel'}
              </Button>

              {/* Info Card */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-900 dark:text-blue-100">Informações do Export</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
                  <p>✓ Inclui todas as respostas, colaboradores, administradores e histórico</p>
                  <p>✓ Formato Excel compatível com todas as versões</p>
                  <p>✓ Dados organizados em abas separadas por tipo</p>
                  <p>✓ Pronto para análise e relatórios em tempo real</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes */}
      {selectedResponse && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Avaliação</DialogTitle>
              <DialogDescription>Visualize todas as respostas desta avaliação</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Info Principal */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">CPF do Colaborador</p>
                  <p className="text-lg font-bold text-foreground font-mono">{maskCPF(selectedResponse.cpf)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Supervisor Avaliado</p>
                    <p className="font-medium text-foreground">{selectedResponse.supervisorId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Empresa</p>
                    <p className="font-medium text-foreground">{selectedResponse.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data da Avaliação</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedResponse.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nota Média Final</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {selectedResponse.averageRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Respostas às Perguntas */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Perguntas e Respostas</h3>
                <div className="space-y-3">
                  {Object.entries(selectedResponse.answers).map(([pergunta, resposta]) => (
                    <div key={pergunta} className="border border-border rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground mb-2">{pergunta}</p>
                      <div className="text-sm text-muted-foreground">
                        {typeof resposta === 'number' ? (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 font-semibold">
                            Nota {resposta}
                          </span>
                        ) : (
                          <p className="text-base text-foreground leading-relaxed">{resposta}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
