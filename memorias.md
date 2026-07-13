# Memórias do Projeto - Avaliaction

## Visão Geral
Plataforma de avaliação anônima para empresas. Gestores criam formulários personalizados, colaboradores respondem anonimamente, e resultados são organizados para tomada de decisão.

## Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui (Radix UI)
- **Backend:** Next.js API Routes, NextAuth v4
- **Banco:** PostgreSQL + Prisma ORM 7
- **Gráficos:** Recharts
- **Exportação:** ExcelJS, jsPDF, xlsx

## Modelos de Dados (Prisma)
- **User** - usuários do sistema (EMPRESA, GERENTE, SUPERVISOR, ADMIN)
- **Cpf** - CPFs autorizados para responder formulários
- **Form** - formulários de avaliação (com lista de CPFs que responderam)
- **Question** - perguntas do formulário (TEXT, AVALIACAO, CHECKBOX, RADIO, LIST, TITULO)
- **Resposta** - respostas vinculadas a um formulário (armazenadas como JSON)

## Estrutura de Diretórios
- `src/app/` - páginas e rotas da aplicação
- `src/components/` - componentes React reutilizáveis
- `src/lib/` - utilitários, tipos, store, integrações
- `prisma/` - schema e migrações
- `scripts/` - scripts auxiliares
- `public/` - assets estáticos

## Regras Importantes
- Nunca alterar o schema do Prisma sem autorização explícita
- Nunca executar migrações automaticamente
- Preservar compatibilidade com código existente
