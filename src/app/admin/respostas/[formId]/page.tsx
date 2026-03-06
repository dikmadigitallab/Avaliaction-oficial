"use client"

import { useEffect, useState } from "react"


type Resposta = {
  id: string
  formId: string
  respostas: any
  createdAt: string
}

export default function RespostasPage() {
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)


  const formId = "70260ca3-faab-41ca-9203-a306f73b5c25" //alterar para pegar o formId dinamicamente, talvez por query ou params

  useEffect(() => {
    async function fetchRespostas() {
      try {
        const res = await fetch(`/api/forms/respostas?formId=${formId}`)
        if (!res.ok) {
          setErro("Não foi possível buscar as respostas")
          return
        }
        const data = await res.json()
        setRespostas(data)
      } catch (err) {
        console.error(err)
        setErro("Erro ao buscar respostas")
      } finally {
        setLoading(false)
      }
    }

    fetchRespostas()
  }, [])

  if (loading) return <div className="p-6 text-white">Carregando...</div>

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Respostas</h1>

      {erro && <div className="text-red-500 mb-4">{erro}</div>}

      {respostas.length === 0 && !erro ? (
        <div className="text-gray-300">Nenhuma resposta encontrada.</div>
      ) : (
        <div className="space-y-4">
          {respostas.map((resposta) => (
            <div
              key={resposta.id}
              className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow"
            >
              <div className="text-sm text-gray-400 mb-2">
                {new Date(resposta.createdAt).toLocaleString()}
              </div>
              <pre className="text-sm overflow-auto text-gray-100">
                {JSON.stringify(resposta.respostas, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}