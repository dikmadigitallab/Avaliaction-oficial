import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";


const TARGET_FORM_ID = "8a12b8b7-3c85-4373-a65b-3ff4c89a3e54"

export async function GET() {
  try {
    // 1. Busca todas as perguntas deste formulário específico
    const perguntasBanco = await prisma.question.findMany({
      where: { formId: TARGET_FORM_ID },
      orderBy: { order: "asc" },
    })

    // 2. Busca todas as respostas deste formulário
    const respostasBanco = await prisma.resposta.findMany({
      where: { formId: TARGET_FORM_ID },
    })

    // Contadores básicos de Usuários no Banco
    const adminsCount = await prisma.user.count({
      where: { userType: { in: ["ADMIN", "ADMINISTRATOR"] } },
    })
    const supervisorsCount = await prisma.user.count({
      where: { userType: "SUPERVISOR" },
    })
    const employeesCount = await prisma.user.count({
      where: { userType: "EMPRESA" },
    })

    // 3. Inicializa o mapa de perguntas para contar os respondentes
    // Vamos criar um dicionário usando o ID da pergunta como chave
    const contagemPerguntasMapa: Record<string, { pergunta: string; tipo: string; totalRespondentes: number }> = {}
    
    perguntasBanco.forEach((q) => {
      contagemPerguntasMapa[q.id] = {
        pergunta: q.pergunta,
        tipo: q.type,
        totalRespondentes: 0,
      }
    })

    let somaNotasGerais = 0
    let totalPerguntasAvaliadas = 0

    respostasBanco.forEach((resp) => {
      const mapaJSON = resp.respostas as Record<string, any>

      // Varre o JSON de cada resposta recebida
      Object.entries(mapaJSON).forEach(([chaveQuestionario, valor]) => {
        // Verifica se a chave do JSON é o ID de uma das perguntas ou o texto exato da pergunta
        const perguntaEncontrada = perguntasBanco.find(
          (q) => q.id === chaveQuestionario || q.pergunta === chaveQuestionario
        )

        if (perguntaEncontrada) {
          // Se houver algum valor preenchido (não nulo e não vazio), conta como respondido
          if (valor !== undefined && valor !== null && valor !== "") {
            contagemPerguntasMapa[perguntaEncontrada.id].totalRespondentes++
          }

          // Se for uma pergunta do tipo AVALIACAO (numérica), soma para as médias gerais
          const nota = Number(valor)
          if (!isNaN(nota) && nota >= 1 && nota <= 5) {
            somaNotasGerais += nota
            totalPerguntasAvaliadas++
          }
        }
      })
    })

    // Formata o array de perguntas e respondentes para o Front-end e Recharts
    const perguntasStats = perguntasBanco.map((q) => ({
      id: q.id,
      pergunta: q.pergunta,
      tipo: q.type,
      quantidadePessoas: contagemPerguntasMapa[q.id]?.totalRespondentes || 0,
    }))

    const avgEvaluation = totalPerguntasAvaliadas > 0 ? (somaNotasGerais / totalPerguntasAvaliadas) : 0

    return NextResponse.json({
      adminsCount,
      supervisorsCount,
      employeesCount,
      evaluationsCount: respostasBanco.length,
      avgEvaluation,
      perguntasStats, // <-- Novos dados estruturados aqui
    })
  } catch (error) {
    console.error("Erro na API de métricas:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}