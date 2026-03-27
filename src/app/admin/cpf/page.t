'use client'

import { useState } from 'react'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, Users, Download, FileSpreadsheet, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

interface AnswerRecord {
  resposta: string
  data: string
}

interface CPFRecord {
  cpf: string
  respostas: AnswerRecord[]
}

export default function CPFsCadastradosPage() {

  const [cpfData, setCpfData] = useState<CPFRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCPF, setSelectedCPF] = useState<CPFRecord | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const parseCPF = (value: string) => value.replace(/\D/g, '')

  const processLines = (lines: string[]) => {

    const map = new Map<string, AnswerRecord[]>()

    lines.forEach((line) => {

      const clean = line.trim()
      if (!clean) return

      const parts = clean.split(';')
      if (parts.length < 3) return

      const cpf = parseCPF(parts[0])
      const resposta = parts[1]
      const data = parts[2]

      if (cpf.length !== 11) return

      if (!map.has(cpf)) map.set(cpf, [])

      map.get(cpf)?.push({
        resposta,
        data
      })

    })

    const result: CPFRecord[] = []

    map.forEach((respostas, cpf) => {
      result.push({
        cpf,
        respostas
      })
    })

    setCpfData(result)

    toast.success(`${result.length} CPFs importados`)
  }

  const handleFileUpload = async (file: File) => {

    const ext = file.name.split('.').pop()?.toLowerCase()

    if (ext === 'txt') {

      const text = await file.text()

      const lines = text
        .replace(/\r/g, '')
        .split('\n')

      processLines(lines)

      return
    }

    if (ext === 'xlsx' || ext === 'xls') {

      const data = await file.arrayBuffer()

      const workbook = XLSX.read(data)

      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      const lines: string[] = []

      rows.forEach((row) => {
        if (!row || row.length < 3) return

        const cpf = String(row[0] ?? '')
        const resposta = String(row[1] ?? '')
        const data = String(row[2] ?? '')

        if (!cpf) return

        lines.push(`${cpf};${resposta};${data}`)
      })

      processLines(lines)

      return
    }

    toast.error('Formato de arquivo inválido')
  }

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleFileUpload(file)
  }

  const deleteCPF = (cpf: string) => {
    setCpfData(prev => prev.filter(c => c.cpf !== cpf))
    toast.success('CPF removido')
  }

  const openDetails = (record: CPFRecord) => {
    setSelectedCPF(record)
    setOpenModal(true)
  }

  const filtered = cpfData.filter(c => c.cpf.includes(searchTerm))

  const exportTXT = () => {

    const lines: string[] = []

    cpfData.forEach(c => {
      c.respostas.forEach(r => {
        lines.push(`${c.cpf};${r.resposta};${r.data}`)
      })
    })

    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8'
    })

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.href = url
    link.download = 'avaliacoes.txt'

    link.click()
  }

  const exportExcel = async () => {

    setIsExporting(true)

    try {

      const ExcelJS = (await import('exceljs')).default

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Avaliações')

      const exportDate = new Date()
      const exportDateFormatted = exportDate.toLocaleDateString('pt-BR')
      const exportTimeFormatted = exportDate.toLocaleTimeString('pt-BR')

      worksheet.mergeCells('A1:C1')
      const titleCell = worksheet.getCell('A1')
      titleCell.value = 'Relatório de Avaliações por CPF'
      titleCell.font = { bold: true, size: 14 }
      titleCell.alignment = { horizontal: 'left', vertical: 'middle' } as const
      worksheet.getRow(1).height = 25

      worksheet.mergeCells('A2:C2')
      const subtitleCell = worksheet.getCell('A2')
      subtitleCell.value = `Gerado em ${exportDateFormatted} às ${exportTimeFormatted}`
      subtitleCell.font = { size: 10 }
      subtitleCell.alignment = { horizontal: 'left', vertical: 'middle' } as const

      const headers = ['CPF', 'Resposta', 'Data']
      const headerRow = worksheet.getRow(4)

      headers.forEach((header, index) => {

        const cell = headerRow.getCell(index + 1)

        cell.value = header

        cell.font = { bold: true }

        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
        } as const

      })

      cpfData.forEach((c, indexCPF) => {

        c.respostas.forEach((r, indexResp) => {

          const rowIndex = 5 + indexCPF + indexResp
          const row = worksheet.getRow(rowIndex)

          row.getCell(1).value = c.cpf
          row.getCell(2).value = r.resposta
          row.getCell(3).value = r.data

          row.eachCell((cell) => {

            cell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            } as const

          })

        })

      })

      worksheet.columns = [
        { width: 18 },
        { width: 40 },
        { width: 20 },
      ]

      const totalRespostas = cpfData.reduce((acc, c) => acc + c.respostas.length, 0)

      const footerRow = 6 + totalRespostas

      worksheet.mergeCells(`A${footerRow}:C${footerRow}`)

      const footerCell = worksheet.getCell(`A${footerRow}`)

      footerCell.value = `Total de respostas: ${totalRespostas}`

      footerCell.font = { size: 10 }

      footerCell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
      } as const

      const buffer = await workbook.xlsx.writeBuffer()

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const link = document.createElement('a')

      const url = URL.createObjectURL(blob)

      link.href = url

      link.download = `avaliacoes-${exportDateFormatted.replace(/\//g, '-')}.xlsx`

      link.click()

      URL.revokeObjectURL(url)

      toast.success('Excel exportado')

    } catch (error) {

      console.error(error)

      toast.error('Erro ao exportar')

    } finally {

      setIsExporting(false)

    }

  }

  const totalRespostas = cpfData.reduce((acc, c) => acc + c.respostas.length, 0)

  return (

    <div className="space-y-6 flex-1 p-6">

      <div>
        <h1 className="text-3xl font-bold">CPFs Cadastrados</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Importação de avaliações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total CPFs</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cpfData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRespostas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Média por CPF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cpfData.length === 0 ? '0' : (totalRespostas / cpfData.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>

      </div>

      <Card>

        <CardHeader>
          <CardTitle>Importar Arquivo</CardTitle>
          <CardDescription>
            formato: cpf;resposta;data
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-4">

          <Input
            type="file"
            accept=".txt,.xlsx,.xls"
            onChange={handleInputFile}
          />

          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>

        </CardContent>

      </Card>

      <Card>

        <CardHeader>
          <CardTitle>Lista de CPFs</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="mb-4">
            <Input
              placeholder="Buscar CPF"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>CPF</TableHead>
                <TableHead>Respostas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {filtered.map((c, index) => (

                <TableRow key={index}>

                  <TableCell className="font-mono">{c.cpf}</TableCell>

                  <TableCell>{c.respostas.length}</TableCell>

                  <TableCell className="flex justify-end gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetails(c)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCPF(c.cpf)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      <Card className="border-2 border-dashed">

        <CardHeader>
          <CardTitle>Exportação</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 justify-center">

          <Button
            onClick={exportExcel}
            disabled={isExporting}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>

          <Button
            onClick={exportTXT}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar TXT
          </Button>

        </CardContent>

      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>

        <DialogContent>

          <DialogHeader>
            <DialogTitle>Respostas</DialogTitle>
          </DialogHeader>

          {selectedCPF && (

            <div className="space-y-3 max-h-[400px] overflow-auto">

              {selectedCPF.respostas.map((r, i) => (

                <div key={i} className="border rounded-lg p-3">

                  <p className="text-sm">{r.resposta}</p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {r.data}
                  </p>

                </div>

              ))}

            </div>

          )}

        </DialogContent>

      </Dialog>

    </div>

  )
}