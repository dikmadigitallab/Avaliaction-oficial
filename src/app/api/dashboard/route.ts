import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function extractOptions(itens: string[]): string[] {
  return itens.filter((i) => !i.startsWith("@METRIC:"))
}

function extractMetrics(itens: string[]): string[] {
  return itens.filter((i) => i.startsWith("@METRIC:")).map((i) => i.replace("@METRIC:", ""))
}

function gerarInsights(
  pergunta: any,
  respostas: any[],
  ocorrencias: Record<string, number>,
  totalRespondidos: number,
  distribuicao: any[],
  totalNumerico: number,
  somaNumerica: number,
  respostasPorDia: Record<string, number>,
): string[] {
  const insights: string[] = []
  if (totalRespondidos === 0) return insights

  const top = Object.entries(ocorrencias).sort(([, a], [, b]) => b - a)
  if (top.length > 0) {
    insights.push(`A maioria respondeu "${top[0][0]}" (${((top[0][1] / totalRespondidos) * 100).toFixed(0)}%)`)
  }

  if (totalNumerico > 0) {
    const media = somaNumerica / totalNumerico
    insights.push(`Média geral: ${media.toFixed(1)} de ${totalNumerico} avaliações`)
  }

  const dias = Object.keys(respostasPorDia).sort()
  if (dias.length >= 2) {
    const ultimo = respostasPorDia[dias[dias.length - 1]] || 0
    const penultimo = respostasPorDia[dias[dias.length - 2]] || 0
    if (penultimo > 0) {
      const variacao = ((ultimo - penultimo) / penultimo) * 100
      if (Math.abs(variacao) > 0) {
        insights.push(`As respostas ${variacao > 0 ? "cresceram" : "caíram"} ${Math.abs(variacao).toFixed(0)}% no último período`)
      }
    }
  }

  const horas: Record<number, number> = {}
  respostas.forEach((r) => {
    const h = new Date(r.createdAt).getHours()
    horas[h] = (horas[h] || 0) + 1
  })
  const melhorHora = Object.entries(horas).sort(([, a], [, b]) => b - a)
  if (melhorHora.length > 0) {
    insights.push(`O horário com mais respostas foi ${melhorHora[0][0]}h (${melhorHora[0][1]} respostas)`)
  }

  if (pergunta.tipo === "AVALIACAO" && totalNumerico > 0) {
    const media = somaNumerica / totalNumerico
    if (media >= 4) insights.push("Avaliação positiva! A maioria dos respondentes está satisfeita")
    else if (media >= 3) insights.push("Avaliação neutra. Há oportunidades de melhoria")
    else insights.push("Avaliação negativa. Atenção: a maioria dos respondentes está insatisfeita")
  }

  if (dias.length >= 7) {
    const primeiraSemana = dias.slice(0, 7).reduce((s, d) => s + (respostasPorDia[d] || 0), 0)
    const ultimaSemana = dias.slice(-7).reduce((s, d) => s + (respostasPorDia[d] || 0), 0)
    if (primeiraSemana > 0) {
      const tendencia = ((ultimaSemana - primeiraSemana) / primeiraSemana) * 100
      if (Math.abs(tendencia) > 10) {
        insights.push(`Tendência ${tendencia > 0 ? "de crescimento" : "de queda"} de ${Math.abs(tendencia).toFixed(0)}% na última semana`)
      }
    }
  }

  if (pergunta.tipo === "TEXT" && totalRespondidos > 0) {
    const tamanhos = respostas.map((r) => {
      const mapa = r.respostas as Record<string, any>
      const v = String(mapa[pergunta.id] ?? mapa[pergunta.pergunta] ?? "")
      return v.length
    }).filter((t) => t > 0)
    if (tamanhos.length > 0) {
      const medio = tamanhos.reduce((s, t) => s + t, 0) / tamanhos.length
      insights.push(`Tamanho médio das respostas: ${Math.round(medio)} caracteres`)
    }
  }

  if (distribuicao.length > 1) {
    const diff = distribuicao[0].quantidade - (distribuicao[1]?.quantidade || 0)
    if (diff > 0) {
      insights.push(`"${distribuicao[0].opcao}" lidera com ${diff} resposta(s) a mais que o segundo lugar`)
    }
  }

  return insights
}

function calcularMetricas(pergunta: any, respostas: any[]) {
  const metrics = extractMetrics(pergunta.itens || [])
  const results: Record<string, any> = {}

  const ocorrencias: Record<string, number> = {}
  let totalRespondidos = 0
  let somaNumerica = 0
  let totalNumerico = 0
  const respostasPorDia: Record<string, number> = {}

  respostas.forEach((r) => {
    const mapa = r.respostas as Record<string, any>
    const valor = mapa[pergunta.id] ?? mapa[pergunta.pergunta]

    const dia = new Date(r.createdAt).toISOString().slice(0, 10)
    respostasPorDia[dia] = (respostasPorDia[dia] || 0) + 1

    if (valor !== undefined && valor !== null && valor !== "") {
      totalRespondidos++
      const strValor = String(valor).trim()

      if (pergunta.tipo === "CHECKBOX") {
        strValor.split(",").map((v: string) => v.trim()).forEach((v: string) => {
          if (v) ocorrencias[v] = (ocorrencias[v] || 0) + 1
        })
      } else {
        ocorrencias[strValor] = (ocorrencias[strValor] || 0) + 1
      }

      const num = Number(valor)
      if (!isNaN(num)) { somaNumerica += num; totalNumerico++ }
    }
  })

  const distribuicao = Object.entries(ocorrencias)
    .map(([opcao, quantidade]) => ({ opcao, quantidade, percentual: totalRespondidos > 0 ? (quantidade / totalRespondidos) * 100 : 0 }))
    .sort((a, b) => b.quantidade - a.quantidade)

  if (metrics.includes("total_respostas") || metrics.includes("quantidade_opcao") || metrics.includes("porcentagem_resposta") || metrics.includes("ranking") || metrics.includes("ranking_respostas") || metrics.includes("porcentagem_opcao")) {
    results.total_respostas_valor = totalRespondidos
  }

  if (metrics.includes("total_respostas")) {
    results.total_respostas = { valor: totalRespondidos, label: `${totalRespondidos} resposta(s)` }
  }

  if (metrics.includes("quantidade_opcao") || metrics.includes("porcentagem_resposta") || metrics.includes("ranking") || metrics.includes("ranking_respostas") || metrics.includes("porcentagem_opcao")) {
    results.distribuicao = distribuicao
  }

  if (metrics.includes("media_notas") && totalNumerico > 0) {
    const media = somaNumerica / totalNumerico
    results.media_notas = { valor: media.toFixed(1), media, label: `${media.toFixed(1)} / 5` }
    results.ranking_notas = [5, 4, 3, 2, 1].map((n) => {
      const item = distribuicao.find((d) => Number(d.opcao) === n)
      return { nota: n, quantidade: item?.quantidade || 0, percentual: item?.percentual || 0 }
    })
  }

  if (metrics.includes("media_geral") && totalNumerico > 0) {
    const media = somaNumerica / totalNumerico
    results.media_geral = { valor: media.toFixed(2), total: totalNumerico, media }
  }

  if (metrics.includes("score_geral") && totalNumerico > 0) {
    const media = somaNumerica / totalNumerico
    const score = Math.min(100, Math.round((media / 5) * 100))
    results.score_geral = { valor: score, label: `${score}%`, media }
    results.gauge = { value: score, max: 100, label: `${score}%` }
  }

  if (metrics.includes("grafico_barras")) {
    results.grafico_barras = distribuicao
  }

  if (metrics.includes("grafico_barras_horizontais")) {
    results.grafico_barras_horizontais = distribuicao
  }

  if (metrics.includes("grafico_pizza")) {
    results.grafico_pizza = distribuicao
  }

  if (metrics.includes("grafico_donut")) {
    results.grafico_donut = distribuicao
  }

  if (metrics.includes("evolucao_diaria") || metrics.includes("respostas_periodo") || metrics.includes("crescimento_diario") || metrics.includes("tendencia_respostas") || metrics.includes("comparacao_periodos")) {
    const dias: Record<string, { count: number; soma: number }> = {}
    respostas.forEach((r) => {
      const dia = new Date(r.createdAt).toISOString().slice(0, 10)
      if (!dias[dia]) dias[dia] = { count: 0, soma: 0 }
      dias[dia].count++

      const mapa = r.respostas as Record<string, any>
      const valor = mapa[pergunta.id] ?? mapa[pergunta.pergunta]
      const num = Number(valor)
      if (!isNaN(num)) dias[dia].soma += num
    })

    const evolucao = Object.entries(dias)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dia, d]) => ({
        dia,
        count: d.count,
        media: d.count > 0 ? d.soma / d.count : 0,
      }))

    if (metrics.includes("evolucao_diaria") && totalNumerico > 0) {
      results.evolucao_diaria = evolucao
    }

    if (metrics.includes("respostas_periodo")) {
      results.respostas_periodo = evolucao.map((e) => ({ dia: e.dia, quantidade: e.count }))
    }

    if (metrics.includes("crescimento_diario") && evolucao.length > 1) {
      const crescimento = evolucao.map((e, i) => {
        const anterior = i > 0 ? evolucao[i - 1].count : 0
        const variacao = anterior > 0 ? ((e.count - anterior) / anterior) * 100 : 0
        return { dia: e.dia, count: e.count, variacao: Number(variacao.toFixed(1)) }
      })
      results.crescimento_diario = crescimento

      const ultimo = crescimento[crescimento.length - 1]
      if (ultimo && crescimento.length > 1) {
        results.crescimento_atual = {
          valor: ultimo.variacao,
          positivo: ultimo.variacao >= 0,
          label: `${ultimo.variacao >= 0 ? "+" : ""}${ultimo.variacao.toFixed(1)}%`,
        }
      }
    }

    if (metrics.includes("tendencia_respostas") && evolucao.length > 1) {
      const valores = evolucao.map((e) => e.count)
      const n = valores.length
      const sumX = valores.reduce((s, v, i) => s + i, 0)
      const sumY = valores.reduce((s, v) => s + v, 0)
      const sumXY = valores.reduce((s, v, i) => s + i * v, 0)
      const sumX2 = valores.reduce((s, v, i) => s + i * i, 0)
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      results.tendencia = {
        inclinacao: slope,
        direcao: slope > 0 ? "crescente" : slope < 0 ? "decrescente" : "estavel",
      }
      results.tendencia_respostas = evolucao
    }

    if (metrics.includes("comparacao_periodos") && evolucao.length > 1) {
      const meio = Math.floor(evolucao.length / 2)
      const periodo1 = evolucao.slice(0, meio)
      const periodo2 = evolucao.slice(meio)
      const total1 = periodo1.reduce((s, d) => s + d.count, 0)
      const total2 = periodo2.reduce((s, d) => s + d.count, 0)
      const media1 = periodo1.length > 0 ? (periodo1.reduce((s, d) => s + d.media, 0) / periodo1.length) : 0
      const media2 = periodo2.length > 0 ? (periodo2.reduce((s, d) => s + d.media, 0) / periodo2.length) : 0
      results.comparacao_periodos = {
        periodo1: { total: total1, media: Number(media1.toFixed(2)), label: `${periodo1[0]?.dia || "?"} a ${periodo1[periodo1.length - 1]?.dia || "?"}` },
        periodo2: { total: total2, media: Number(media2.toFixed(2)), label: `${periodo2[0]?.dia || "?"} a ${periodo2[periodo2.length - 1]?.dia || "?"}` },
        variacao_total: total1 > 0 ? Number((((total2 - total1) / total1) * 100).toFixed(1)) : 0,
        variacao_media: media1 > 0 ? Number((((media2 - media1) / media1) * 100).toFixed(1)) : 0,
      }
    }
  }

  if (metrics.includes("melhor_horario")) {
    const horas: Record<number, number> = {}
    respostas.forEach((r) => {
      const h = new Date(r.createdAt).getHours()
      horas[h] = (horas[h] || 0) + 1
    })
    const sorted = Object.entries(horas).sort(([, a], [, b]) => b - a)
    results.melhor_horario = {
      distribuicao: Object.entries(horas)
        .map(([hora, quantidade]) => ({ hora: `${hora}h`, quantidade }))
        .sort((a, b) => parseInt(a.hora) - parseInt(b.hora)),
      pico: sorted.length > 0 ? { hora: `${sorted[0][0]}h`, quantidade: sorted[0][1] } : null,
    }
  }

  if (metrics.includes("ultimas_respostas")) {
    results.ultimas_respostas = respostas
      .slice(-10)
      .reverse()
      .map((r) => {
        const mapa = r.respostas as Record<string, any>
        return {
          id: r.id,
          valor: mapa[pergunta.id] ?? mapa[pergunta.pergunta] ?? "",
          data: r.createdAt,
        }
      })
      .filter((r) => r.valor !== "")
  }

  if (metrics.includes("tempo_medio_resposta") && respostas.length > 1) {
    const tempos: number[] = []
    for (let i = 1; i < respostas.length; i++) {
      const diff = new Date(respostas[i].createdAt).getTime() - new Date(respostas[i - 1].createdAt).getTime()
      tempos.push(diff)
    }
    const mediaTempo = tempos.length > 0 ? tempos.reduce((s, t) => s + t, 0) / tempos.length : 0
    results.tempo_medio_resposta = {
      ms: mediaTempo,
      segundos: Math.round(mediaTempo / 1000),
      minutos: Math.round(mediaTempo / 60000),
      label: mediaTempo > 3600000
        ? `${(mediaTempo / 3600000).toFixed(1)}h`
        : mediaTempo > 60000
          ? `${Math.round(mediaTempo / 60000)}min`
          : `${Math.round(mediaTempo / 1000)}s`,
    }
  }

  if (metrics.includes("palavras_comuns") || metrics.includes("nuvem_palavras")) {
    const palavras: Record<string, number> = {}
    respostas.forEach((r) => {
      const mapa = r.respostas as Record<string, any>
      const valor = String(mapa[pergunta.id] ?? mapa[pergunta.pergunta] ?? "")
      const tokens = valor.toLowerCase().split(/[\s,.;!?]+/).filter((w: string) => w.length > 3)
      tokens.forEach((w: string) => { palavras[w] = (palavras[w] || 0) + 1 })
    })
    const sorted = Object.entries(palavras)
      .map(([palavra, quantidade]) => ({ palavra, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 50)
    if (metrics.includes("palavras_comuns")) results.palavras_comuns = sorted.slice(0, 30)
    if (metrics.includes("nuvem_palavras")) {
      const maxQtd = sorted.length > 0 ? sorted[0].quantidade : 1
      results.nuvem_palavras = sorted.map((p) => ({
        ...p,
        tamanho: Math.max(0.5, p.quantidade / maxQtd),
      }))
    }
  }

  if (metrics.includes("sentimento_respostas") && pergunta.tipo === "TEXT") {
    const palavrasPositivas = ["bom", "ótimo", "excelente", "maravilhoso", "incrível", "gostei", "adorei", "perfeito", "satisfeito", "feliz", "top", "legal", "show", "parabéns", "obrigado"]
    const palavrasNegativas = ["ruim", "péssimo", "horrível", "terrível", "odeio", "detestei", "frustrante", "insatisfeito", "triste", "raiva", "pior", "fracasso", "falha", "problema"]

    let positivo = 0, negativo = 0, neutro = 0
    respostas.forEach((r) => {
      const mapa = r.respostas as Record<string, any>
      const valor = String(mapa[pergunta.id] ?? mapa[pergunta.pergunta] ?? "").toLowerCase()
      const temPalavraPositiva = palavrasPositivas.some((p) => valor.includes(p))
      const temPalavraNegativa = palavrasNegativas.some((p) => valor.includes(p))
      if (temPalavraPositiva && !temPalavraNegativa) positivo++
      else if (temPalavraNegativa && !temPalavraPositiva) negativo++
      else neutro++
    })
    const total = positivo + negativo + neutro
    results.sentimento_respostas = {
      positivo: { valor: positivo, percentual: total > 0 ? (positivo / total) * 100 : 0 },
      neutro: { valor: neutro, percentual: total > 0 ? (neutro / total) * 100 : 0 },
      negativo: { valor: negativo, percentual: total > 0 ? (negativo / total) * 100 : 0 },
      dominante: positivo > negativo ? "positivo" : negativo > positivo ? "negativo" : "neutro",
    }
  }

  const insights = gerarInsights(pergunta, respostas, ocorrencias, totalRespondidos, distribuicao, totalNumerico, somaNumerica, respostasPorDia)

  return { metricas: results, totalRespondidos, distribuicao, insights }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get("formId")

    if (!formId) {
      const forms = await prisma.form.findMany({
        select: { id: true, name: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ forms })
    }

    const [perguntas, respostasRaw] = await Promise.all([
      prisma.question.findMany({ where: { formId }, orderBy: { order: "asc" } }),
      prisma.resposta.findMany({ where: { formId }, orderBy: { createdAt: "asc" } }),
    ])

    const respostas = respostasRaw.map((r) => {
      let dados = r.respostas as any
      if (Array.isArray(dados)) {
        const dict: Record<string, any> = {}
        dados.forEach((item: any) => {
          if (item.Pergunta && item.Resposta !== undefined) {
            dict[item.Pergunta] = item.Resposta
          }
        })
        dados = dict
      }
      return { ...r, respostas: dados }
    })

    const respostasComData = respostas.filter((r) => r.createdAt)
    const horas: Record<number, number> = {}
    respostasComData.forEach((r) => {
      const h = new Date(r.createdAt).getHours()
      horas[h] = (horas[h] || 0) + 1
    })
    const melhorHora = Object.entries(horas).sort(([, a], [, b]) => b - a)
    const pico = Object.entries(
      respostasComData.reduce((acc: Record<string, number>, r) => {
        const dia = new Date(r.createdAt).toISOString().slice(0, 10)
        acc[dia] = (acc[dia] || 0) + 1
        return acc
      }, {})
    ).sort(([, a], [, b]) => b - a)

    const perguntasNormais = perguntas.filter(
      (q) => q.type !== "TITULO" || !q.pergunta.startsWith("@INDICADOR:"),
    )

    const perguntasComMetricas = perguntasNormais.map((q) => {
      const calc = calcularMetricas(q, respostas)
      return {
        id: q.id,
        pergunta: q.pergunta,
        tipo: q.type,
        order: q.order,
        itens: extractOptions(q.itens || []),
        metricasSelecionadas: extractMetrics(q.itens || []),
        totalRespondidos: calc.totalRespondidos,
        ...calc.metricas,
        insights: calc.insights,
      }
    })

    const totalSubmissoes = respostas.length

    const insightsGlobais: string[] = []
    if (totalSubmissoes === 0) {
      insightsGlobais.push("Nenhuma resposta recebida ainda. Compartilhe o formulário para começar.")
    } else {
      insightsGlobais.push(`Total de ${totalSubmissoes} resposta(s) recebida(s)`)
      if (melhorHora.length > 0) {
        insightsGlobais.push(`Pico de respostas às ${melhorHora[0][0]}h (${melhorHora[0][1]} respostas)`)
      }
      if (pico.length > 0) {
        insightsGlobais.push(`Dia com mais respostas: ${pico[0][0]} (${pico[0][1]} respostas)`)
      }
      const pergComMetricas = perguntasComMetricas.filter((p) => p.metricasSelecionadas.length > 0)
      if (pergComMetricas.length > 0) {
        insightsGlobais.push(`${pergComMetricas.length} pergunta(s) com métricas ativas`)
      }
    }

    return NextResponse.json({
      formId,
      totalSubmissoes,
      perguntas: perguntasComMetricas,
      datas: {
        primeira: respostas[0]?.createdAt || null,
        ultima: respostas[respostas.length - 1]?.createdAt || null,
      },
      insights: insightsGlobais,
      horaPico: melhorHora.length > 0 ? melhorHora[0][0] : null,
      diaPico: pico.length > 0 ? pico[0][0] : null,
    })
  } catch (error) {
    console.error("Erro na API de dashboard:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
