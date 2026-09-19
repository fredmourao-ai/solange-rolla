# Pol├¡tica Universal de Auditoria

Esta pol├¡tica ├® obrigat├│ria para qualquer agente humano ou automatizado que trabalhe neste reposit├│rio.

**Vers├úo global:** `2026-09-16-historical-state-transition-v2`

## Regra permanente
Nenhuma implementa├º├úo, feature, release ou projeto pode ser declarado conclu├¡do apenas porque c├│digo foi escrito, build passou ou testes ficaram verdes. Antes da conclus├úo, devem ser validados comportamento, regress├Áes, integra├º├Áes afetadas, dados, estados, rotinas autom├íticas e riscos operacionais pertinentes.

## AUDIT_RUNTIME_PARITY_V1 ÔÇö regra global obrigat├│ria
Toda auditoria formal deve executar tamb├®m `docs/quality/AUDIT_RUNTIME_PARITY_V1.md` como complemento obrigat├│rio e insepar├ível de `docs/quality/EXTREME_AUDIT_PROTOCOL.md`.

├ë proibido declarar `APTO` com fluxo cr├¡tico validado apenas localmente ou apenas por carregamento de p├ígina/healthcheck. Quando houver UI, opera├º├Áes cr├¡ticas e muta├º├Áes devem ser executadas pela UI real contra o mesmo release/ambiente certificado, com reload/revisita e confirma├º├úo da persist├¬ncia/efeito. Quando n├úo houver UI, use a interface operacional can├┤nica publicada.

Em homologa├º├úo web, `5xx`, `pageerror`, `requestfailed`, `console.error` ou tela de erro inesperados s├úo gate de falha at├® investiga├º├úo, salvo allowlist estreita, versionada e justificada. A su├¡te local e a su├¡te executada no ambiente publicado devem ser comparadas; fluxo cr├¡tico local sem evid├¬ncia equivalente publicada ├® d├¡vida de evid├¬ncia e bloqueia `APTO`.

Defeito descoberto ap├│s auditoria que deveria estar no escopo ├® `AUDIT_ESCAPE`: al├®m de corrigir o defeito, investigue por que a auditoria n├úo o detectou, identifique a classe de falha, procure equivalentes e reaudite essa classe nos demais projetos onde for aplic├ível. Uma lacuna sist├¬mica deve atualizar a regra global, n├úo apenas o caso isolado.

## Matriz de transi├º├Áes de estado e dados hist├│ricos
A **matriz de transi├º├Áes de estado e dados hist├│ricos** ├® obrigat├│ria para qualquer fluxo persistido ou stateful. A auditoria deve cruzar, conforme aplic├ível:
1. opera├º├úo/transi├º├úo: criar, ler, no-op update, editar campos, cancelar, reabrir, arquivar, restaurar, retry, undo e toda transi├º├úo de dom├¡nio;
2. proveni├¬ncia/forma do dado: novo/atual, legado/pr├®-migra├º├úo, migrado/backfill, parcial/null-edge, snapshot/pol├¡tica/evento versionado, estado intermedi├írio e terminal;
3. superf├¡cie: muta├º├Áes usadas por operador/usu├írio devem ocorrer pela UI real; API, SQL, scripts e chamadas diretas s├úo apoio, n├úo substituem a prova pela UI;
4. p├│s-condi├º├úo: persist├¬ncia, hist├│rico/audit log, estados dependentes, efeitos externos, idempot├¬ncia/retry e confirma├º├úo ap├│s recarregar/reabrir.

Antes de marcar um fluxo como coberto, inventarie no ambiente alvo as classes materiais de estado, vers├úo, nullabilidade e formato hist├│rico realmente existentes. Classe material n├úo exercitada = `N├âO VALIDADO`; happy path em seed atual n├úo certifica compatibilidade hist├│rica.

Quando c├│digo atual consome JSON persistido, snapshots, eventos ou estruturas versionadas, prove migra├º├úo/backfill completo ou normaliza├º├úo expl├¡cita das vers├Áes hist├│ricas suportadas. Type cast n├úo ├® evid├¬ncia de compatibilidade.

Qualquer muta├º├úo operacional que produza 5xx, tela gen├®rica de erro, `This page couldnÔÇÖt load`, blank state ou error boundary bloqueia `APTO` at├® causa raiz, classe de dados afetada, corre├º├úo e regress├úo serem comprovadas.

## Quando a auditoria extrema ├® obrigat├│ria
Execute integralmente `docs/quality/EXTREME_AUDIT_PROTOCOL.md` **e** `docs/quality/AUDIT_RUNTIME_PARITY_V1.md` quando houver qualquer uma destas condi├º├Áes:
- projeto, m├│dulo ou release declarado "pronto", "finalizado", "100%", "apto para produ├º├úo" ou equivalente;
- solicita├º├úo expl├¡cita de auditoria, valida├º├úo completa, revis├úo extrema ou investiga├º├úo sist├¬mica;
- mudan├ºa material em autentica├º├úo/autoriza├º├úo, schema, regras financeiras, m├íquina de estados, multi-tenant, integra├º├Áes externas, workers, filas, cron/scheduler, infraestrutura, deploy, backup/restore ou regras cr├¡ticas de neg├│cio;
- incidente relevante, regress├úo sist├¬mica, `AUDIT_ESCAPE` ou evid├¬ncia de diverg├¬ncia entre c├│digo e produ├º├úo.

## Princ├¡pios
1. O protocolo ├® piso m├¡nimo, nunca teto. Crie novas categorias de investiga├º├úo quando o dom├¡nio ou as evid├¬ncias exigirem.
2. Diferencie sempre `COMPROVADO`, `INFERIDO`, `HIP├ôTESE A VALIDAR` e `N├âO VALIDADO`.
3. Procure n├úo apenas c├│digo incorreto, mas tamb├®m rotinas ausentes, estados sem sa├¡da, produtor sem consumidor, consumidor sem produtor, dados sem reconcilia├º├úo e opera├º├Áes sem recupera├º├úo.
4. N├úo declare 100% auditado se qualquer ├írea cr├¡tica permanecer n├úo validada.
5. Toda auditoria deve estar ligada a um commit/release identific├ível. Mudan├ºa material posterior invalida a cobertura correspondente.
6. Achados cr├¡ticos devem ser reproduzidos e, quando seguro/autorizado, corrigidos, testados, regredidos e reauditados.
7. Produ├º├úo s├│ ├® considerada validada quando houver evid├¬ncia de que o artefato/release auditado ├® o que realmente est├í executando.
8. N├úo fa├ºa mudan├ºa destrutiva apenas para satisfazer a auditoria; classifique a corre├º├úo como SAFE, REVIEW, MIGRATION ou DESTRUCTIVE.
9. Happy path em dados rec├®m-criados n├úo certifica compatibilidade hist├│rica nem cobertura de transi├º├Áes.

## Estado e dom├¡nio
- Atualize `docs/quality/AUDIT_STATUS.md` ao concluir uma auditoria formal.
- Leia `docs/quality/AUDIT_OVERLAY.md` para regras espec├¡ficas deste projeto.

## Prompt curto de ativa├º├úo
Use:

> Execute integralmente `docs/quality/EXTREME_AUDIT_PROTOCOL.md`, `docs/quality/AUDIT_RUNTIME_PARITY_V1.md` e `docs/quality/AUDIT_OVERLAY.md`. Assuma Auditor + Consultor + Operador. Reconstrua o sistema real, inventarie dados atuais/legados/migrados, compare cobertura local e publicada, execute opera├º├Áes cr├¡ticas pela interface can├┤nica no release certificado, trate erros inesperados de runtime como gate, confirme persist├¬ncia ap├│s reload/reopen, corrija o seguro, execute regress├úo e reauditoria contradit├│ria e s├│ conclua ap├│s o Gate Final de Completude. Diferencie COMPROVADO, INFERIDO, HIP├ôTESE A VALIDAR e N├âO VALIDADO.

## EXECUTION_OWNERSHIP_FAILOVER_V1 ÔÇö supervisao global de subagentes
Toda delegacao para subagente e uma execucao supervisionada. O agente controlador continua sendo o dono da conclusao e deve monitorar a tarefa desde o disparo, registrando identidade da sessao/processo, inicio, estado/commit de base, artefatos esperados e evidencias objetivas de progresso.

Durante a execucao, devem existir checkpoints limitados de progresso. Estar `rodando`, ter PID ou manter uma sessao aberta nao basta: progresso precisa ser comprovado por arquivos, commits, testes, relatorios, acoes concluidas ou evidencia equivalente da tarefa.

Falha, limite, autenticacao/tooling indisponivel, encerramento sem artefatos ou ausencia de progresso acompanhada de evidencia de bloqueio/ociosidade/travamento/timeout exigem takeover automatico: preserve trabalho util e assuma diretamente ou substitua por sessao limpa. O usuario nunca deve precisar enviar `siga`, `continue` ou mensagem equivalente para recuperar a execucao.

### Persistencia de supervisao fora do chat
O estado de monitoramento de subagentes deve ser persistido em arquivo/ledger do projeto e sobreviver a espera, reconexao, verificacoes adicionais, limite ou interrupcao da resposta do ChatGPT.

Indicadores da interface do chat nao contam como evidencia de progresso do subagente. Ao retomar, o controlador deve ler o estado persistido, verificar artefatos/commits/testes/efeitos reais e executar takeover automatico quando os criterios de falha ou estagnacao forem satisfeitos.
