# Memorias

Registro de decisões e alterações do projeto.

## Sessão

| Data | Decisão | Autor |
|------|---------|-------|
| 2026-07-07 | `hiskra-code` sem argumentos agora auto-inicia `.opencode/` e lança o opencode | VIBECODE |
| 2026-07-07 | Adicionado `--help` / `-h` / `help` para exibir ajuda | VIBECODE |
| 2026-07-07 | `hiskra-code` sem args verifica versão e avisa se precisar de update antes de abrir opencode | VIBECODE |
| 2026-07-09 | v4.0.0 — Modo Legado: comando `conect`, motor NVIDIA com tool calling, streaming, histórico | VIBECODE |
| 2026-07-09 | `conect-config.js`: gerencia `.opencode/conect.json` com provider, modelo, baseUrl | VIBECODE |
| 2026-07-09 | `nvidia-api.js`: cliente NVIDIA NIM com listagem de modelos, chat streaming, tool calling | VIBECODE |
| 2026-07-09 | `engine-tools.js`: 10 ferramentas (bash, read, edit, write, glob, grep, todowrite, websearch, webfetch, task) | VIBECODE |
| 2026-07-09 | `engine-context.js`: histórico com truncagem automática por limite de tokens | VIBECODE |
| 2026-07-09 | `engine-prompt.js`: system prompt dinâmico combinando config.md + orquestrador + skills | VIBECODE |
| 2026-07-09 | `engine-nvidia.js`: motor principal com loop de conversa interativo e tool calling multi-turn | VIBECODE |
| 2026-07-09 | `index.cjs` (initProject): cria `.env` com KEY_NVIDIA padrão + `.gitignore` com `.env` | VIBECODE |
| 2026-07-09 | `nvidia-api.js`: `DEFAULT_NVIDIA_KEY` embutida como chave padrão do pacote | VIBECODE |

<!-- Migrado de memorias.md (raiz) -->
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

## 2026-08-20 — Toggle "Resposta por CPF" na tela principal de formulários
- **Decisão:** Adicionado campo `requireCpf Boolean @default(true)` no model `Form` (autorizado pelo usuário).
  - `false` = formulário não exige CPF para responder (link direto `/responder/[id]/anonimo`)
- **Front:** `/admin/formularios` — switch **"Multi-respostas"** no card de cada formulário (atualização via PUT `/api/forms`)
- **2026-08-20 (ajuste):** Removida a opção "Resposta por CPF" da tela principal a pedido do usuário. Ficou apenas o switch "Multi-respostas". A funcionalidade `requireCpf` permanece no schema/API (default `true` = comportamento original), mas não é exposta na UI.
- **API:**
  - `api/forms` POST/PUT aceitam `requireCpf`
  - `api/authForm` GET: se `requireCpf=false` libera acesso direto (sem checar `cpf_list`); POST: não registra CPF
- **Fluxo de resposta:** `responder/[id]` busca `requireCpf` via `/api/forms/details` e redireciona para `/responder/[id]/anonimo` quando desativado. Proteção na página `[cpf]`: se exige CPF e rota é "anonimo", volta para validação.
- **Pendência:** migração no banco ainda NÃO aplicada (ver checkpoints).
- **Observação:** page.txt em `src/app/admin/` é código antigo de login por CPF (localStorage) mantido como referência.