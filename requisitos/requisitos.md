# Requisitos do Projeto Avaliaction

> **Projeto:** Avaliaction-oficial (Dikma)  
> **Versão:** 0.2.1  
> **Data da Análise:** 14/07/2026  
> **Descrição:** Plataforma de avaliação anônima de supervisores para empresas

---

## 📋 Resumo Geral

O projeto é uma plataforma web para coleta de feedback anônimo de colaboradores sobre supervisores, com foco em:
- Formulários personalizados com diferentes tipos de pergunta
- Validação por CPF para garantir respostas autenticadas
- Dashboard analítico com métricas e gráficos
- Exportação de dados (Excel/PDF)
- Sistema de usuários com diferentes níveis de acesso

---

## 🔐 Módulo 1: Autenticação e Acesso

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-01 | Login com email e senha via NextAuth.js | Alta | ✅ Implementado |
| RF-02 | Autenticação via JWT (JSON Web Tokens) | Alta | ✅ Implementado |
| RF-03 | Suporte a 5 tipos de usuário: EMPRESA, GERENTE, SUPERVISOR, ADMINISTRATOR, ADMIN | Alta | ✅ Implementado |
| RF-04 | Hash de senhas com bcrypt | Alta | ✅ Implementado |
| RF-05 | Controle de acesso por role (server-side) | Alta | ✅ Implementado |
| RF-06 | Logout e encerramento de sessão | Média | ✅ Implementado |
| RF-07 | Redirecionamento automático pós-login | Média | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-01 | Senhas devem ser hasheadas com bcrypt (custo ≥ 10) | Alta |
| RNF-02 | Tokens JWT devem expirar em no máximo 24h | Alta |
| RNF-03 | Sessões devem ser armazenadas em httpOnly cookies | Alta |

---

## 📝 Módulo 2: Formulários

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-08 | Criar formulários com nome e configuração de anonimato | Alta | ✅ Implementado |
| RF-09 | Suporte a 6 tipos de pergunta: TEXT, AVALIAÇÃO, CHECKBOX, RADIO, LIST, TÍTULO | Alta | ✅ Implementado |
| RF-10 | Definir ordem de exibição das perguntas | Média | ✅ Implementado |
| RF-11 | Marcar perguntas como obrigatórias | Média | ✅ Implementado |
| RF-12 | Adicionar itens/opções para perguntas do tipo CHECKBOX, RADIO e LIST | Média | ✅ Implementado |
| RF-13 | Editar formulários existentes | Alta | ✅ Implementado |
| RF-14 | Excluir formulários | Alta | ✅ Implementado |
| RF-15 | Listar todos os formulários do usuário | Alta | ✅ Implementado |
| RF-16 | Preview de formulários antes de publicar | Média | ✅ Implementado |
| RF-17 | Vincular formulário ao criador (userId) | Alta | ✅ Implementado |
| RF-18 | Compartilhar formulário via link | Alta | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-04 | Formulários devem ser salvos no banco PostgreSQL via Prisma | Alta |
| RNF-05 | Operações CRUD devem retornar status HTTP apropriados | Média |

---

## 🕵️ Módulo 3: Respostas e Anonimato

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-19 | Validar CPF antes de permitir resposta ao formulário | Alta | ✅ Implementado |
| RF-20 | Armazenar CPF hasheado (SHA-256) para manter anonimato | Alta | ✅ Implementado |
| RF-21 | Criptografar CPF para exibição (máscara: ***.***.***-XX) | Média | ✅ Implementado |
| RF-22 | Impedir respostas duplicadas (mesmo CPF não responde 2x) | Alta | ✅ Implementado |
| RF-23 | Lista de CPFs autorizados por formulário | Média | ✅ Implementado |
| RF-24 | Salvar respostas como JSON | Alta | ✅ Implementado |
| RF-25 | Campo de observação do gestor nas respostas | Média | ✅ Implementado |
| RF-26 | Página de agradecimento após envio | Baixa | ✅ Implementado |
| RF-27 | Buscar título do formulário antes da resposta | Média | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-06 | CPFs devem ser hasheados com SHA-256 antes de salvar | Alta |
| RNF-07 | Respostas devem ser armazenadas de forma anônima | Alta |
| RNF-08 | Validação de CPF deve seguir formato XXX.XXX.XXX-XX | Média |

---

## 📊 Módulo 4: Dashboard e Analytics

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-28 | Dashboard analítico com métricas gerais | Alta | ✅ Implementado |
| RF-29 | Gráficos de barras para distribuição de respostas | Média | ✅ Implementado |
| RF-30 | Gráficos de pizza para proporções | Média | ✅ Implementado |
| RF-31 | Gráficos de linha para tendências | Média | ✅ Implementado |
| RF-32 | Gráficos de radar para múltiplas dimensões | Média | ✅ Implementado |
| RF-33 | Métricas por tipo de pergunta (40+ métricas) | Alta | ✅ Implementado |
| RF-34 | Análise de sentimento em respostas de texto | Média | ✅ Implementado |
| RF-35 | Insights automáticos por pergunta | Média | ✅ Implementado |
| RF-36 | Métricas configuráveis (média, ranking, crescimento) | Média | ✅ Implementado |
| RF-37 | Comparação de períodos | Média | ✅ Implementado |
| RF-38 | Horário pico de respostas | Baixa | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-09 | Dashboard deve carregar em menos de 3 segundos | Média |
| RNF-10 | Gráficos devem ser responsivos | Média |

---

## 🏢 Módulo 5: Empresas e Supervisores

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-39 | CRUD completo de empresas | Alta | ✅ Implementado |
| RF-40 | CRUD completo de supervisores | Alta | ✅ Implementado |
| RF-41 | Vincular supervisor a empresa | Alta | ✅ Implementado |
| RF-42 | Avaliação de supervisores em 5 dimensões | Alta | ✅ Implementado |
| RF-43 | Dimensões: Liderança, Comunicação, Respeito, Organização, Apoio à Equipe | Alta | ✅ Implementado |
| RF-44 | Rating com estrelas (1-5) | Média | ✅ Implementado |
| RF-45 | Verificação se já avaliou supervisor | Média | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-11 | Empresas e supervisores devem ter nomes únicos por contexto | Média |

---

## 👥 Módulo 6: Gestão de Usuários e CPFs

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-46 | CRUD de usuários | Alta | ✅ Implementado |
| RF-47 | Gerenciamento de CPFs (lista por formulário) | Média | ✅ Implementado |
| RF-48 | Gestão de colaboradores | Média | ✅ Implementado |
| RF-49 | Ativar/desativar usuários | Média | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-12 | CPFs devem ser únicos no sistema | Alta |
| RNF-13 | Emails devem ser únicos | Alta |

---

## 📤 Módulo 7: Exportação e Relatórios

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-50 | Exportação para Excel (.xls) via ExcelJS | Alta | ✅ Implementado |
| RF-51 | Exportação para PDF via jsPDF | Alta | ✅ Implementado |
| RF-52 | Logs de acesso (login, avaliação, admin) | Média | ✅ Implementado |
| RF-53 | Página de relatórios | Média | ✅ Implementado |
| RF-54 | Página de feedbacks | Baixa | ✅ Implementado |
| RF-55 | Exportação de avaliações com período | Média | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-14 | Exportações devem ser geradas em menos de 10 segundos | Média |
| RNF-15 | Arquivos exportados devem ter formatação adequada | Média |

---

## 🛡️ Módulo 8: Segurança e Não-Funcionais

### Requisitos Funcionais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-56 | Filtro automático de palavrões | Média | ✅ Implementado |
| RF-57 | Dark/Light mode | Baixa | ✅ Implementado |
| RF-58 | Layout responsivo (mobile) | Alta | ✅ Implementado |
| RF-59 | Validação de formulários com Zod | Alta | ✅ Implementado |

### Requisitos Não-Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RNF-16 | Dados sensíveis não devem ser expostos no client-side | Crítica |
| RNF-17 | Variáveis de ambiente devem estar em .env (não no repositório) | Crítica |
| RNF-18 | Build não deve ignorar erros de TypeScript | Alta |
| RNF-19 | Evitar armazenamento duplicado (Prisma + localStorage) | Média |
| RNF-20 | Performance: páginas devem carregar em < 2s | Média |

---

## ⚠️ Riscos Identificados

| Severidade | Risco | Descrição | Mitigação |
|------------|-------|-----------|-----------|
| 🔴 Crítica | Exposição de credenciais | `.env` com credenciais reais no repositório | Mover para variáveis de ambiente do Vercel/Supabase |
| 🔴 Crítica | Build permissivo | `ignoreBuildErrors: true` mascara erros | Remover e corrigir erros |
| 🟡 Média | Consistência de dados | Sistema dual (Prisma + localStorage) | Unificar fonte de dados |
| 🟡 Média | Versão inicial | Projeto em v0.2.1 | Documentar e testar |

---

## 📊 Resumo Estatístico

| Categoria | Total | Implementados | Pendentes |
|-----------|-------|---------------|-----------|
| Autenticação e Acesso | 10 | 10 | 0 |
| Formulários | 11 | 11 | 0 |
| Respostas e Anonimato | 11 | 11 | 0 |
| Dashboard e Analytics | 11 | 11 | 0 |
| Empresas e Supervisores | 7 | 7 | 0 |
| Gestão de Usuários e CPFs | 4 | 4 | 0 |
| Exportação e Relatórios | 6 | 6 | 0 |
| Segurança e Não-Funcionais | 6 | 4 | 2 |
| **Total** | **66** | **64** | **2** |

---

## 🔧 Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Estilo | Tailwind CSS v4, shadcn/ui |
| Backend | Next.js API Routes |
| Banco | PostgreSQL (Supabase) via Prisma |
| Autenticação | NextAuth.js 4 |
| Validação | Zod, React Hook Form |
| Gráficos | Recharts |
| Exportação | ExcelJS, jsPDF |
| Animações | Framer Motion |

---

## 📁 Estrutura de Diretórios

```
src/
├── app/
│   ├── admin/          # Painel administrativo
│   │   ├── dashboard/
│   │   ├── formularios/
│   │   ├── usuarios/
│   │   ├── respostas/
│   │   ├── exportacao/
│   │   ├── logs/
│   │   ├── relatorios/
│   │   ├── feedbacks/
│   │   ├── cpf/
│   │   └── colaboradores/
│   ├── api/            # Rotas da API
│   │   ├── auth/
│   │   ├── forms/
│   │   ├── create-user/
│   │   ├── companies/
│   │   ├── supervisors/
│   │   └── evaluations/
│   ├── responder/      # Fluxo de resposta
│   ├── login/          # Autenticação
│   └── evaluate/       # Avaliação
├── components/         # Componentes React
├── lib/                # Utilitários e configurações
└── hooks/              # Hooks customizados
```

---

*Documento gerado automaticamente pela análise do código-fonte.*
