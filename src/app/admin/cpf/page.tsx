"use client"

import { useState } from "react"
import { Search, Users, ShieldCheck, Clock } from "lucide-react"

type Usuario = {
  cpf: string
  nome: string
  dataLogin: string
  status: string
}

export default function CpfsLogados() {
  const [busca, setBusca] = useState("")

  const usuarios: Usuario[] = [
    {
      cpf: "123.456.789-00",
      nome: "João Silva",
      dataLogin: "09/03/2026 08:10",
      status: "Online",
    },
    {
      cpf: "987.654.321-00",
      nome: "Maria Oliveira",
      dataLogin: "09/03/2026 08:22",
      status: "Online",
    },
    {
      cpf: "741.852.963-00",
      nome: "Carlos Souza",
      dataLogin: "09/03/2026 08:40",
      status: "Online",
    },
  ]

  const filtrados = usuarios.filter(
    (u) =>
      u.cpf.toLowerCase().includes(busca.toLowerCase()) ||
      u.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              CPFs Logados
            </h1>
            <p className="text-gray-500 text-sm">
              Controle de usuários autenticados no sistema
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
            <Users size={18} />
            <span className="font-semibold">{usuarios.length}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <Users className="text-blue-600" size={28} />
            <div>
              <p className="text-sm text-gray-500">Usuários Online</p>
              <p className="text-xl font-bold">{usuarios.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <ShieldCheck className="text-green-600" size={28} />
            <div>
              <p className="text-sm text-gray-500">Sessões Ativas</p>
              <p className="text-xl font-bold">{usuarios.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <Clock className="text-purple-600" size={28} />
            <div>
              <p className="text-sm text-gray-500">Último Login</p>
              <p className="text-xl font-bold">08:40</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">
              Lista de Acessos
            </h2>

            <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 w-64">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Buscar CPF ou nome"
                className="bg-transparent outline-none ml-2 w-full text-sm"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3">CPF</th>
                  <th className="py-3">Nome</th>
                  <th className="py-3">Data de Login</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((usuario, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-medium">{usuario.cpf}</td>
                    <td className="py-3">{usuario.nome}</td>
                    <td className="py-3">{usuario.dataLogin}</td>
                    <td className="py-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {usuario.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}