# LEGADO — Solange Rolla MVP local

> **REPOSITÓRIO HISTÓRICO / SUPERSEDIDO — NÃO USAR PARA NOVO DESENVOLVIMENTO.**
>
> O projeto Solange Rolla ativo e canônico está em **`fredmourao-ai/solange-rolla-consultorio`**. Todo código novo, issue, auditoria, release, planejamento e operação deve ocorrer no repositório canônico.

Este repositório preserva o primeiro MVP local do sistema Solange Rolla para fins de histórico e proveniência. Ele não representa o sistema atual e não deve ser usado como fonte de verdade de arquitetura, segurança, prontidão ou produção.

## Estado deste repositório

- **Status:** legado/congelado.
- **Desenvolvimento funcional:** proibido.
- **Auditoria de prontidão:** não existe mais aqui; a issue #9 foi encerrada como duplicada/supersedida.
- **Fonte canônica:** `fredmourao-ai/solange-rolla-consultorio`.
- **Ledger de auditoria válido:** `fredmourao-ai/solange-rolla-consultorio/docs/quality/AUDIT_STATUS.md`.
- **Governança da unificação:** `fredmourao-ai/solange-rolla-consultorio#147`.

## O que este repositório contém

O MVP histórico foi implementado em HTML/CSS/JavaScript com persistência em `localStorage` e serviu para validar conceitos iniciais de operação diária, clientes, agenda, financeiro, eventos, fiscal e trilha de auditoria.

Arquivos históricos preservados:

- `AUDITORIA_SOLANGE.md`: auditoria técnica do MVP local e seus riscos residuais;
- `ARQUITETURA_SOLANGE.md`: proposta arquitetural inicial;
- `index.html`: interface principal do MVP local;
- `styles.css`: identidade visual/layout do protótipo;
- `app.js`: lógica do MVP, persistência local e validações.

Esses arquivos permanecem deliberadamente no histórico. Eles **não devem ser migrados para a aplicação moderna apenas por preservação**.

## Limitações históricas conhecidas

O MVP não possui backend transacional, autenticação real, integração fiscal/pagamento real, suporte multiusuário, isolamento adequado de dados sensíveis ou backup/restore confiável. Por isso, ele nunca deve ser usado com dados reais nem como evidência de prontidão do sistema atual.

## Continuidade do projeto

Consulte o repositório canônico:

**`fredmourao-ai/solange-rolla-consultorio`**

A linhagem e a reconciliação entre este MVP e o sistema atual estão documentadas em:

`docs/legacy/solange-rolla-mvp-lineage.md`

no repositório canônico.

## Regra final

Qualquer nova tarefa funcional criada aqui deve ser interrompida e recriada no repositório canônico. Este repositório existe apenas para preservar histórico e proveniência.
