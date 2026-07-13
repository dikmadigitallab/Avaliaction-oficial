# Instruções para IA

## Fluxo Obrigatório
1. Analisar estrutura do projeto
2. Ler memorias.md, checkpoints.md e instrucoes.md
3. Se houver dúvida não respondida aqui, perguntar ao usuário
4. Apresentar resumo do entendimento antes de alterar
5. Aguardar confirmação do usuário

## Regras Críticas
- Nunca alterar schema do Prisma
- Nunca executar migrações
- Preservar compatibilidade com código existente
- Evitar mudanças desnecessárias
- Não remover funcionalidades existentes sem autorização

## Fluxo de Execução
1. Entender o objetivo
2. Identificar arquivos envolvidos
3. Analisar dependências
4. Executar mudanças
5. Verificar regressões
6. Executar `npm run build`
7. Corrigir erros de build
8. Finalizar apenas com build bem-sucedido

## Comandos
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
