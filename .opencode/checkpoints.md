# Checkpoints

Registro do estado de cada sessão do projeto.
Consulte no início de cada interação para saber onde parou.

---

## Estado Inicial

- Projeto inicializado com `hiskra-code init`

## v2.1.0 — Templates + init interativo

- `memorias.md`, `checkpoints.md`, `ideias.md` → templates fornecidos ao usuário
- `initial-prompt.md` → template que pergunta "O que deseja construir?"
- `requisitos.md` → template com tabelas de requisitos
- `index.cjs` → initProject copia templates
- `cli.js` → init interativo com perguntas sobre prompt e requisitos
- Flag `--quiet` para init silencioso

## v2.3.0 — Token Economy Policy

- `skills/token-economy.md` criada
- `config.md` compactado (107→57 linhas)
- Todos os 14 skills reescritos (média 230→20 linhas)
- Todos os 16 agents reescritos (média 13→10 linhas)
- Economia total: 74,3% de redução de tokens (21.314→5.475)

## v2.3.0 — Update Mechanism

- `index.cjs`: versão check via npm registry + `isOutdated()`
- `cli.js`: comando `hiskra-code update` + version check automático + `--version`
- `package.json`: v2.2.2 → v2.3.0

## v3.1.0 — Auto-init + Launch opencode

- `cli.js`: `hiskra-code` sem argumentos agora:
  - Faz auto-init do `.opencode/` se não existir
  - Verifica atualizações antes de iniciar
  - Lança o `opencode` automaticamente
- `cli.js`: `--help` / `-h` / `help` explícitos para exibir ajuda
- `AGENTS.md`: documentação atualizada com novo fluxo

## v4.0.0 — Modo Legado (NVIDIA Engine)

- **Novo comando `hiskra-code conect`**: menu interativo para escolher entre opencode e modo legado
- **`conect-config.js`**: gerencia `.opencode/conect.json` (provider, modelo, baseUrl)
- **`nvidia-api.js`**: cliente completo da API NVIDIA NIM (OpenAI-compatible)
  - Listagem de modelos via `GET /v1/models`
  - Chat completion com streaming SSE
  - Suporte a tool calling (function calling)
  - Fallback para lista de modelos populares
- **`engine-tools.js`**: 10 ferramentas implementadas (bash, read, edit, write, glob, grep, todowrite, websearch, webfetch, task)
- **`engine-context.js`**: gerenciamento de histórico da conversa com truncagem automática
- **`engine-prompt.js`**: montagem do system prompt dinâmico (config.md + orquestrador + skills)
- **`engine-nvidia.js`**: motor principal com loop de conversa interativo, tool calling multi-turn
- **`cli.js`**:
  - Comando `conect` com menu de escolha e listagem de modelos NVIDIA
  - Modo legado: `hiskra-code` sem argumentos inicia engine NVIDIA se configurado
  - Comandos `/exit`, `/reset`, `/help`, `/stats` no loop de conversa
- **`package.json`**: v3.1.0 → v4.0.0, novos arquivos incluídos no `files`
- **Key no `.env`**: `KEY_NVIDIA=nvapi-...`

<!-- Migrado de checkpoints.md (raiz) -->
# Checkpoints - Avaliaction

## Concluídos
- [x] Landing page com tema escuro/claro
- [x] Sistema de autenticação (login)
- [x] Criação de formulários (form-builder)
- [x] Validação de CPF ao acessar formulário
- [x] Envio de link por WhatsApp e email
- [x] Exportação de dados (Excel/PDF)
- [x] Página de avaliação (responder formulário)
- [x] Dashboard na página admin
- [x] Sidebar de administração

## Pendentes
- [ ] Página de visualização de respostas
- [ ] Logs de acesso (desenvolvedores)
- [ ] Dashboard de dados (quem respondeu, etc.)
- [ ] Relatórios completos na página admin
- [ ] Exportação de respostas por período (data início / data fim)
- [ ] Sidebar de exportação dedicada

## 2026-08-20 — Sessão: Toggle "Resposta por CPF"
- [x] Campo `requireCpf` adicionado ao schema Prisma (authorized pelo usuário)
- [x] API forms: POST/PUT aceitam `requireCpf`
- [x] API authForm: respeita `requireCpf` (GET libera acesso direto; POST não registra CPF)
- [x] Tela `/admin/formularios`: switches "Resposta por CPF" e "Multi-respostas" nos cards
- [x] **Ajuste:** opção "Resposta por CPF" removida da UI a pedido do usuário. Ficou apenas o switch "Multi-respostas". Backend `requireCpf` mantido (default true), não exposto na UI.
- [x] `responder/[id]`: redireciona para `/responder/[id]/anonimo` quando `requireCpf=false`
- [x] Proteção na página `[cpf]` contra acesso anônimo indevido
- [x] Build OK
- [x] **Banco atualizado** (autorizado pelo usuário): `ALTER TABLE "Form" ADD COLUMN "requireCpf" BOOLEAN NOT NULL DEFAULT true` aplicado via `prisma db execute`
- [ ] **ATENÇÃO:** `prisma migrate dev` detecta drift pré-existente (coluna `allowMultipleResponses` no banco não registrada nas migrações). Não rodar `migrate reset` — apagaria dados. Para criar a migração registrada seria necessário, mas não foi feito para não arriscar dados.