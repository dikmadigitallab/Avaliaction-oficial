"use client"

import React, { useEffect, useState } from "react"
import { Loader2, BarChart3, PieChart, Users, CheckCircle } from "lucide-react"

const TARGET_FORM_ID = "8a12b8b7-3c85-4373-a65b-3ff4c89a3e54"

// Estrutura para os blocos de contagem das opções
interface OpcaoContagem {
  opcao: string
  quantidade: number
  percentual: number
}

interface PerguntaConsolidada {
  numeroPergunta: number
  nomePergunta: string
  totalRespostasValidas: number
  distribuicao: OpcaoContagem[]
}

interface DashboardStats {
  totalSubmissoes: number
  consolidadoPorPergunta: PerguntaConsolidada[]
}

export default function DashboardConsolidadoPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function processarDadosConsolidados() {
      try {
        const res = await fetch(`/api/forms/respostas?formId=${TARGET_FORM_ID}`)
        const json = await res.json()
        const submissoes = Array.isArray(json) ? json : []

        if (submissoes.length === 0) {
          setStats({ totalSubmissoes: 0, consolidadoPorPergunta: [] })
          return
        }

        // Dicionário dinâmico para agrupar as opções por índice da pergunta
        // Estrutura: { [indexPergunta]: { [textoOpcao]: quantidade } }
        const agrupamentoPerguntas: Record<number, Record<string, number>> = {}
        const nomesDasPerguntas: Record<number, string> = {}

        submissoes.forEach((sub) => {
          const arrRespostas = Array.isArray(sub.respostas) ? sub.respostas : []
          
          arrRespostas.forEach((item: any, idx: number) => {
            const numeroPergunta = idx + 1
            const textoPergunta = item?.Pergunta || item?.pergunta || `Pergunta ${numeroPergunta}`
            let valorResposta = item?.Resposta

            // Salva o enunciado real da pergunta baseado no primeiro mapeamento válido
            if (!nomesDasPerguntas[numeroPergunta] && textoPergunta) {
              nomesDasPerguntas[numeroPergunta] = textoPergunta
            }

            // Tratamento e limpeza do texto digitado/selecionado
            if (valorResposta !== undefined && valorResposta !== null) {
              valorResposta = String(valorResposta).trim()
              
              // Se a resposta não for uma string vazia
              if (valorResposta !== "") {
                if (!agrupamentoPerguntas[numeroPergunta]) {
                  agrupamentoPerguntas[numeroPergunta] = {}
                }
                
                // Incrementa o contador da opção escolhida para aquela pergunta
                agrupamentoPerguntas[numeroPergunta][valorResposta] = 
                  (agrupamentoPerguntas[numeroPergunta][valorResposta] || 0) + 1
              }
            }
          })
        })

        // Converte os dicionários em uma estrutura limpa e ordenada para o front-end
        const consolidadoPorPergunta: PerguntaConsolidada[] = Object.entries(agrupamentoPerguntas).map(
          ([numStr, opcoesDicio]) => {
            const numeroPergunta = Number(numStr)
            
            // Calcula o total de pessoas que responderam especificamente ESTA pergunta
            const totalRespostasValidas = Object.values(opcoesDicio).reduce((a, b) => a + b, 0)

            // Transforma o dicionário de opções em uma lista ordenada com percentual
            const distribuicao: OpcaoContagem[] = Object.entries(opcoesDicio)
              .map(([opcao, qtd]) => ({
                opcao,
                quantidade: qtd,
                percentual: totalRespostasValidas > 0 ? (qtd / totalRespostasValidas) * 100 : 0
              }))
              .sort((a, b) => b.quantidade - a.quantidade) // Mostra as opções mais votadas primeiro

            return {
              numeroPergunta,
              nomePergunta: nomesDasPerguntas[numeroPergunta] || `Pergunta ${numeroPergunta}`,
              totalRespostasValidas,
              distribuicao
            }
          }
        ).sort((a, b) => a.numeroPergunta - b.numeroPergunta) // Ordena da Pergunta 1 até a última

        setStats({
          totalSubmissoes: submissoes.length,
          consolidadoPorPergunta
        })
      } catch (err) {
        console.error("Erro ao calcular consolidação:", err)
      } finally {
        setLoading(false)
      }
    }

    processarDadosConsolidados()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#EFF6F4] dark:bg-[#0B161A]">
        <Loader2 className="animate-spin text-emerald-500 h-9 w-9" />
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Contabilizando e cruzando respostas...</p>
      </div>
    )
  }

  if (!stats || stats.consolidadoPorPergunta.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF6F4] dark:bg-[#0B161A]">
        <p className="text-gray-500">Nenhum dado encontrado para consolidação estatística.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EFF6F4] dark:bg-[#0B161A] text-gray-900 dark:text-slate-200 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TITULAÇÃO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Métricas de Respostas por Item</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Contagem volumétrica exata de votos e opções selecionadas para cada pergunta.
            </p>
          </div>
          
          {/* CARD DO TOTAL GERAL */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm shrink-0">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Fichas Avaliadas</p>
              <p className="text-xl font-black text-gray-800 dark:text-white">{stats.totalSubmissoes}</p>
            </div>
          </div>
        </div>

        {/* CONTAINER DINÂMICO DE PERGUNTAS */}
        <main className="space-y-8">
          {stats.consolidadoPorPergunta.map((bloco) => (
            <section 
              key={bloco.numeroPergunta}
              className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* CABEÇALHO DA PERGUNTA */}
              <div className="p-5 bg-gray-50 dark:bg-white/[0.01] border-b border-gray-150 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg tracking-wide shrink-0 mt-0.5">
                    ITEM {bloco.numeroPergunta}
                  </span>
                  <h2 className="text-base font-bold text-gray-800 dark:text-slate-100 leading-snug">
                    {bloco.nomePergunta}
                  </h2>
                </div>
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap bg-gray-200/50 dark:bg-white/5 px-2.5 py-1 rounded-md">
                  {bloco.totalRespostasValidas} respondentes
                </span>
              </div>

              {/* LISTAGEM QUANTITATIVA (TABELA/PROGRESSO) */}
              <div className="p-6 space-y-4">
                {bloco.distribuicao.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    
                    {/* Linha de dados textuais */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                        {item.opcao}
                      </span>
                      <span className="text-xs font-mono text-gray-500 dark:text-slate-400">
                        <b className="text-gray-900 dark:text-white font-bold">{item.quantidade}</b> {item.quantidade === 1 ? "pessoa" : "pessoas"} ({item.percentual.toFixed(1)}%)
                      </span>
                    </div>

                    {/* Barra visual de preenchimento proporcional */}
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>

                  </div>
                ))}
              </div>

            </section>
          ))}
        </main>

      </div>
    </div>
  )
}