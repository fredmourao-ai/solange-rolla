# Arquitetura Proposta do Sistema Solange

Data da versao: 2026-09-03

## Objetivo

Consolidar operacao de clientes, agenda, financeiro, calendario de eventos e
emissao de nota fiscal em um sistema unico, com foco em controle operacional,
seguranca de dados e fluxo de trabalho claro.

## Modulos

### 1. Clientes

- Cadastro principal
- Dados para NF
- Data de nascimento
- Email
- Telefone
- Contato de emergencia
- Observacoes internas

### 2. Agenda

- Agendamentos
- Confirmacao
- Reagendamento
- Cancelamento
- Presenca
- Historico por cliente

### 3. Financeiro

- Lancamentos
- Pagamentos pendentes
- Recebimentos
- Status de inadimplencia
- Concilicao por atendimento e por evento

### 4. Eventos

- Calendario
- Planejamento de eventos
- Lista de participantes
- Relacao evento x pagamento x NF

### 5. Fiscal

- Perfil fiscal do cliente
- Emissao de NF
- Status da nota
- Reenvio em caso de rejeicao
- Vinculo entre nota, servico e pagamento

## Entidades principais

### Cliente

- `id`
- `nome`
- `cpf`
- `data_nascimento`
- `email`
- `telefone`
- `endereco`
- `observacoes`
- `ativo`

### ContatoEmergencia

- `id`
- `cliente_id`
- `nome`
- `telefone`
- `grau_relacao`

### PerfilFiscal

- `id`
- `cliente_id`
- `cpf_cnpj`
- `inscricao_municipal`
- `razao_nome_nf`
- `endereco_fiscal`

### Agendamento

- `id`
- `cliente_id`
- `inicio`
- `fim`
- `status`
- `origem`
- `observacoes`

### Evento

- `id`
- `titulo`
- `inicio`
- `fim`
- `local`
- `capacidade`
- `status`

### ParticipacaoEvento

- `id`
- `evento_id`
- `cliente_id`
- `status`

### LancamentoFinanceiro

- `id`
- `cliente_id`
- `agendamento_id`
- `evento_id`
- `tipo`
- `descricao`
- `valor`
- `vencimento`
- `status`

### NotaFiscal

- `id`
- `cliente_id`
- `lancamento_id`
- `numero`
- `serie`
- `status`
- `chave_acesso`
- `emitida_em`
- `mensagem_rejeicao`

## Arquitetura tecnica recomendada

## Camadas

1. Frontend web responsivo
2. Backend API com regras de negocio
3. Banco relacional
4. Integracao fiscal desacoplada
5. Logs e trilha de auditoria

## Stack sugerida

- Frontend: `React` ou `Next.js`
- Backend: `Node.js` com `TypeScript`
- Banco: `PostgreSQL`
- ORM: `Prisma`
- Auth: sessao com perfis `admin`, `operacional`, `financeiro`
- Auditoria: tabela de `activity_log`

## Regras operacionais

1. Cadastro nao deve depender de emissao de NF para existir.
2. Agenda deve conseguir operar mesmo quando o modulo fiscal estiver
   indisponivel.
3. Todo pagamento confirmado deve poder acionar fluxo de elegibilidade para NF.
4. Dados sensiveis devem ser exibidos por perfil.
5. Toda alteracao relevante deve gerar log com `quem`, `quando` e `o que`.

## Fluxos principais

### Cadastro e agendamento

1. Cadastrar cliente
2. Validar CPF e contatos
3. Registrar contato de emergencia
4. Criar agendamento
5. Confirmar comparecimento
6. Gerar cobranca

### Fechamento financeiro

1. Registrar atendimento ou evento
2. Criar lancamento financeiro
3. Confirmar pagamento
4. Habilitar emissao de NF
5. Emitir nota
6. Persistir retorno do emissor

## Seguranca e compliance

1. Criptografar dados sensiveis em repouso quando aplicavel.
2. Mascarar CPF e telefone em telas amplas.
3. Exigir logs para exclusoes e alteracoes fiscais.
4. Separar permissoes de visualizacao de dados clinicos e financeiros.
5. Implementar backup automatico e restauracao testada.

## Direcao visual

1. Painel principal orientado a operacao do dia.
2. Hierarquia clara entre urgencia, agenda e receita.
3. Fichas compactas para clientes e eventos.
4. Calendario e agenda com destaque forte de horario.
5. Visual humano e sofisticado, sem aparencia generica de ERP.
