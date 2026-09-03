# Sistema Solange

MVP local funcional para operacao diaria, cadastro de clientes, agenda,
financeiro, eventos, fiscal e trilha de auditoria.

## Arquivos

- `AUDITORIA_SOLANGE.md`: reauditoria tecnica do estado atual e riscos residuais.
- `ARQUITETURA_SOLANGE.md`: proposta estrutural do sistema.
- `index.html`: interface principal do MVP local.
- `styles.css`: identidade visual e layout responsivo.
- `app.js`: logica do MVP, persistencia local, validacoes e renderizacao.

## Como executar

1. Entre em `C:\solange-rolla`.
2. Rode `python -m http.server 4173`.
3. Abra `http://127.0.0.1:4173/` no navegador.

Tambem e possivel abrir `index.html` diretamente, mas a validacao principal foi
feita via `localhost`.

## O que ja existe

- painel com metricas, agenda critica e alertas operacionais
- cadastro de clientes com validacao de CPF duplicado
- agenda com status de atendimento
- financeiro com baixa operacional
- eventos com capacidade e calendario
- fiscal com notas e status de emissao
- exportacao local em JSON
- trilha de auditoria local
- persistencia em `localStorage`

## Limites atuais

- nao existe backend
- nao existe autenticacao
- nao existe integracao real com nota fiscal ou pagamento
- dados sensiveis ainda ficam apenas no navegador
- nao existe suporte multiusuario
