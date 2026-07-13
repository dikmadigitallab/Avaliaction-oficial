export type QuestionType = "TEXT" | "AVALIACAO" | "CHECKBOX" | "RADIO" | "LIST" | "TITULO"

export interface MetricaDef {
  value: string
  label: string
  desc: string
  icon: string
  category?: string
}

export const METRICAS_POR_TIPO: Record<QuestionType, MetricaDef[]> = {
  TEXT: [
    { value: "total_respostas", label: "Total de respostas", desc: "Contagem total de respostas recebidas", icon: "Users", category: "contagem" },
    { value: "ultimas_respostas", label: "Últimas respostas", desc: "Lista das respostas mais recentes", icon: "MessageCircle", category: "tempo_real" },
    { value: "palavras_comuns", label: "Palavras mais usadas", desc: "Palavras que mais aparecem nas respostas", icon: "MessageSquareText", category: "texto" },
    { value: "nuvem_palavras", label: "Nuvem de palavras", desc: "Visualização em nuvem das palavras mais frequentes", icon: "Cloud", category: "texto" },
    { value: "sentimento_respostas", label: "Sentimento das respostas", desc: "Análise de sentimento positiva, neutra ou negativa", icon: "SmilePlus", category: "texto" },
    { value: "respostas_periodo", label: "Respostas por período", desc: "Quantidade de respostas ao longo do tempo", icon: "CalendarDays", category: "tempo" },
    { value: "crescimento_diario", label: "Crescimento diário", desc: "Variação percentual dia a dia", icon: "TrendingUp", category: "tempo" },
    { value: "comparacao_periodos", label: "Comparação entre períodos", desc: "Compare respostas entre dois períodos", icon: "CalendarCheck", category: "tempo" },
    { value: "melhor_horario", label: "Melhor horário de engajamento", desc: "Horário com maior número de respostas", icon: "Clock", category: "tempo" },
    { value: "tempo_medio_resposta", label: "Tempo médio de resposta", desc: "Tempo médio entre abertura e resposta", icon: "Timer", category: "comportamento" },
    { value: "tendencia_respostas", label: "Tendência de respostas", desc: "Linha de tendência das respostas ao longo do tempo", icon: "TrendingUp", category: "tempo" },
  ],
  AVALIACAO: [
    { value: "total_respostas", label: "Total de respostas", desc: "Contagem total de respostas recebidas", icon: "Users", category: "contagem" },
    { value: "media_notas", label: "Média de notas", desc: "Média geral com estrelas", icon: "Star", category: "numerico" },
    { value: "media_geral", label: "Média geral", desc: "Média calculada de todas as avaliações", icon: "Calculator", category: "numerico" },
    { value: "score_geral", label: "Score geral do formulário", desc: "Score consolidado em porcentagem", icon: "Gauge", category: "numerico" },
    { value: "grafico_barras", label: "Gráfico de barras", desc: "Distribuição em barras verticais", icon: "BarChart3", category: "grafico" },
    { value: "grafico_barras_horizontais", label: "Barras horizontais", desc: "Distribuição em barras horizontais", icon: "BarChartHorizontal", category: "grafico" },
    { value: "grafico_pizza", label: "Gráfico de pizza", desc: "Proporção em pizza", icon: "PieChart", category: "grafico" },
    { value: "grafico_donut", label: "Gráfico donut", desc: "Proporção em formato donut", icon: "ChartPie", category: "grafico" },
    { value: "evolucao_diaria", label: "Evolução diária", desc: "Média ao longo dos dias", icon: "TrendingUp", category: "tempo" },
    { value: "ranking", label: "Ranking de notas", desc: "Distribuição de 1 a 5 estrelas", icon: "ListChecks", category: "numerico" },
    { value: "ranking_respostas", label: "Ranking de respostas", desc: "Posição relativa das avaliações", icon: "Trophy", category: "numerico" },
    { value: "porcentagem_opcao", label: "Porcentagem por opção", desc: "Percentual de cada nota", icon: "Percent", category: "numerico" },
    { value: "crescimento_diario", label: "Crescimento diário", desc: "Variação percentual da média dia a dia", icon: "TrendingUp", category: "tempo" },
    { value: "comparacao_periodos", label: "Comparação entre períodos", desc: "Compare médias entre dois períodos", icon: "CalendarCheck", category: "tempo" },
    { value: "melhor_horario", label: "Melhor horário de engajamento", desc: "Horário com maior número de avaliações", icon: "Clock", category: "tempo" },
    { value: "respostas_periodo", label: "Respostas por período", desc: "Quantidade de respostas ao longo do tempo", icon: "CalendarDays", category: "tempo" },
    { value: "ultimas_respostas", label: "Últimas respostas", desc: "Avaliações mais recentes recebidas", icon: "MessageCircle", category: "tempo_real" },
  ],
  RADIO: [
    { value: "total_respostas", label: "Total de respostas", desc: "Contagem total de respostas recebidas", icon: "Users", category: "contagem" },
    { value: "quantidade_opcao", label: "Quantidade por opção", desc: "Número de respostas por opção", icon: "ListChecks", category: "numerico" },
    { value: "porcentagem_resposta", label: "Porcentagem por resposta", desc: "Percentual de cada opção", icon: "Percent", category: "numerico" },
    { value: "grafico_barras", label: "Gráfico de barras", desc: "Distribuição em barras verticais", icon: "BarChart3", category: "grafico" },
    { value: "grafico_barras_horizontais", label: "Barras horizontais", desc: "Distribuição em barras horizontais", icon: "BarChartHorizontal", category: "grafico" },
    { value: "grafico_pizza", label: "Gráfico de pizza", desc: "Proporção em pizza", icon: "PieChart", category: "grafico" },
    { value: "grafico_donut", label: "Gráfico donut", desc: "Proporção em formato donut", icon: "ChartPie", category: "grafico" },
    { value: "respostas_periodo", label: "Respostas por período", desc: "Quantidade ao longo do tempo", icon: "CalendarDays", category: "tempo" },
    { value: "ranking", label: "Ranking", desc: "Opções mais escolhidas", icon: "TrendingUp", category: "numerico" },
    { value: "ranking_respostas", label: "Ranking de respostas", desc: "Opções ranqueadas por popularidade", icon: "Trophy", category: "numerico" },
    { value: "comparacao_periodos", label: "Comparação entre períodos", desc: "Comparar respostas entre períodos", icon: "CalendarCheck", category: "tempo" },
    { value: "crescimento_diario", label: "Crescimento diário", desc: "Variação percentual dia a dia", icon: "TrendingUp", category: "tempo" },
    { value: "melhor_horario", label: "Melhor horário de engajamento", desc: "Horário com mais respostas", icon: "Clock", category: "tempo" },
    { value: "ultimas_respostas", label: "Últimas respostas", desc: "Respostas mais recentes recebidas", icon: "MessageCircle", category: "tempo_real" },
    { value: "score_geral", label: "Score geral", desc: "Pontuação consolidada do formulário", icon: "Gauge", category: "numerico" },
  ],
  CHECKBOX: [
    { value: "total_respostas", label: "Total de respostas", desc: "Contagem total de respostas recebidas", icon: "Users", category: "contagem" },
    { value: "quantidade_opcao", label: "Quantidade por opção", desc: "Número de vezes que cada opção foi marcada", icon: "ListChecks", category: "numerico" },
    { value: "porcentagem_resposta", label: "Porcentagem por resposta", desc: "Percentual de cada opção", icon: "Percent", category: "numerico" },
    { value: "grafico_barras", label: "Gráfico de barras", desc: "Distribuição em barras verticais", icon: "BarChart3", category: "grafico" },
    { value: "grafico_barras_horizontais", label: "Barras horizontais", desc: "Distribuição em barras horizontais", icon: "BarChartHorizontal", category: "grafico" },
    { value: "grafico_pizza", label: "Gráfico de pizza", desc: "Proporção em pizza", icon: "PieChart", category: "grafico" },
    { value: "grafico_donut", label: "Gráfico donut", desc: "Proporção em formato donut", icon: "ChartPie", category: "grafico" },
    { value: "ranking", label: "Ranking", desc: "Opções mais escolhidas", icon: "TrendingUp", category: "numerico" },
    { value: "ranking_respostas", label: "Ranking de respostas", desc: "Opções ranqueadas por popularidade", icon: "Trophy", category: "numerico" },
    { value: "respostas_periodo", label: "Respostas por período", desc: "Quantidade ao longo do tempo", icon: "CalendarDays", category: "tempo" },
    { value: "comparacao_periodos", label: "Comparação entre períodos", desc: "Comparar respostas entre períodos", icon: "CalendarCheck", category: "tempo" },
    { value: "crescimento_diario", label: "Crescimento diário", desc: "Variação percentual dia a dia", icon: "TrendingUp", category: "tempo" },
    { value: "melhor_horario", label: "Melhor horário de engajamento", desc: "Horário com mais respostas", icon: "Clock", category: "tempo" },
    { value: "ultimas_respostas", label: "Últimas respostas", desc: "Respostas mais recentes recebidas", icon: "MessageCircle", category: "tempo_real" },
  ],
  LIST: [
    { value: "total_respostas", label: "Total de respostas", desc: "Contagem total de respostas recebidas", icon: "Users", category: "contagem" },
    { value: "quantidade_opcao", label: "Quantidade por opção", desc: "Número de respostas por opção", icon: "ListChecks", category: "numerico" },
    { value: "porcentagem_resposta", label: "Porcentagem por resposta", desc: "Percentual de cada opção", icon: "Percent", category: "numerico" },
    { value: "grafico_barras", label: "Gráfico de barras", desc: "Distribuição em barras verticais", icon: "BarChart3", category: "grafico" },
    { value: "grafico_barras_horizontais", label: "Barras horizontais", desc: "Distribuição em barras horizontais", icon: "BarChartHorizontal", category: "grafico" },
    { value: "grafico_pizza", label: "Gráfico de pizza", desc: "Proporção em pizza", icon: "PieChart", category: "grafico" },
    { value: "grafico_donut", label: "Gráfico donut", desc: "Proporção em formato donut", icon: "ChartPie", category: "grafico" },
    { value: "ranking", label: "Ranking", desc: "Opções mais escolhidas", icon: "TrendingUp", category: "numerico" },
    { value: "ranking_respostas", label: "Ranking de respostas", desc: "Opções ranqueadas por popularidade", icon: "Trophy", category: "numerico" },
    { value: "respostas_periodo", label: "Respostas por período", desc: "Quantidade ao longo do tempo", icon: "CalendarDays", category: "tempo" },
    { value: "comparacao_periodos", label: "Comparação entre períodos", desc: "Comparar respostas entre períodos", icon: "CalendarCheck", category: "tempo" },
    { value: "crescimento_diario", label: "Crescimento diário", desc: "Variação percentual dia a dia", icon: "TrendingUp", category: "tempo" },
    { value: "melhor_horario", label: "Melhor horário de engajamento", desc: "Horário com mais respostas", icon: "Clock", category: "tempo" },
    { value: "ultimas_respostas", label: "Últimas respostas", desc: "Respostas mais recentes recebidas", icon: "MessageCircle", category: "tempo_real" },
  ],
  TITULO: [],
}

export function extractOptions(itens: string[]): string[] {
  return itens.filter((i) => !i.startsWith("@METRIC:"))
}

export function extractMetrics(itens: string[]): string[] {
  return itens.filter((i) => i.startsWith("@METRIC:")).map((i) => i.replace("@METRIC:", ""))
}

export function buildItens(options: string[], metrics: string[]): string[] {
  return [...options, ...metrics.map((m) => `@METRIC:${m}`)]
}
