# AUDIT_RUNTIME_PARITY_V1 ÔÇö Regra Global de Auditoria de Opera├º├úo Real

Esta regra ├® **obrigat├│ria e insepar├ível** de `AUDIT_POLICY.md` e `docs/quality/EXTREME_AUDIT_PROTOCOL.md` em toda auditoria formal, valida├º├úo de release ou declara├º├úo de sistema pronto/apto. Ela existe para impedir falso positivo de auditoria em que um fluxo funciona em teste local, mas falha no ambiente realmente publicado.

## 1. Regra de equival├¬ncia operacional

Uma tela carregada, um healthcheck verde, HTTP 200, teste unit├írio/integrado ou um fluxo local bem-sucedido **n├úo certifica** o comportamento publicado.

Para cada opera├º├úo aplic├ível do sistema, monte e execute a matriz:

`opera├º├úo ÔåÆ cobertura local ÔåÆ cobertura staging/preview/publicada ÔåÆ execu├º├úo real ÔåÆ persist├¬ncia/efeito ÔåÆ evid├¬ncia`

Opera├º├Áes incluem, conforme o dom├¡nio: `Create`, `Read`, `Update`, `Delete`, `Archive`, `Restore`, `Cancel`, `Reopen`, `Retry`, `Undo`, `Approve`, `Reject`, `Confirm`, `Send`, `Charge`, `Refund`, `Appeal`, `Reconcile`, `Import`, `Export`, `Deploy` e `Rollback`.

Fluxo cr├¡tico presente na su├¡te local, mas ausente da homologa├º├úo executada contra o ambiente/release certificado, ├® **D├ìVIDA DE EVID├èNCIA** e bloqueia `APTO`.

## 2. UI real ├® obrigat├│ria quando existe UI

Quando o produto possui interface de usu├írio, toda opera├º├úo cr├¡tica ou de altera├º├úo de estado deve ser exercitada pela **UI real** no navegador contra o mesmo release/ambiente que est├í sendo certificado. API, SQL, fixtures e scripts podem preparar dados ou verificar o efeito, mas n├úo substituem a a├º├úo do operador na UI.

A auditoria deve cobrir tanto dados rec├®m-criados quanto registros j├í existentes/legados quando essa diferen├ºa puder alterar o comportamento.

Ap├│s cada muta├º├úo:
1. confirme o feedback imediato da UI;
2. recarregue a p├ígina;
3. navegue para fora e retorne ao registro;
4. confirme que o estado persistiu na UI;
5. quando autorizado, confirme tamb├®m banco/fila/API/efeito externo dur├ível;
6. valide hist├│rico/auditoria/reconcilia├º├úo quando aplic├ível.

## 3. Gate fatal de erros de navegador e servidor

Em E2E/homologa├º├úo de aplica├º├Áes web, qualquer ocorr├¬ncia inesperada abaixo reprova o fluxo e a auditoria at├® investiga├º├úo:

- resposta HTTP `5xx` de aplica├º├úo;
- `pageerror`/exce├º├úo n├úo tratada;
- `requestfailed` inesperado;
- `console.error` inesperado;
- tela de erro de framework/proxy/servidor, inclusive mensagens equivalentes a `This page couldn't load`;
- navega├º├úo ou Server Action que termina em erro mesmo que a p├ígina anterior tenha carregado corretamente.

Exce├º├Áes s├│ podem existir em allowlist **estreita, versionada e justificada**, contendo origem, motivo, impacto e teste que demonstra por que o evento ├® esperado. Allowlist gen├®rica ├® proibida.

Respostas `4xx` s├│ s├úo sucesso quando o pr├│prio caso de teste ├® negativo e comprova que aquele `4xx` ├® o comportamento esperado.

## 4. Paridade local ├ù ambiente publicado

Antes do veredito, gere invent├írio dos testes/fluxos operacionais locais e compare com os realmente executados em staging/preview/publica├º├úo.

├ë proibido certificar produ├º├úo executando apenas um subconjunto ÔÇ£representativoÔÇØ se esse subconjunto omite opera├º├úo cr├¡tica existente na su├¡te local. Se a su├¡te externa precisar ser menor, a exclus├úo de cada fluxo deve ser expl├¡cita e o fluxo deve receber evid├¬ncia equivalente no mesmo release.

A homologa├º├úo deve confirmar que o SHA/build/digest esperado ├® o efetivamente servido pelo ambiente testado. Sem proveni├¬ncia do release, marque `VERS├âO EM PRODU├ç├âO N├âO COMPROVADA`.

## 5. Evid├¬ncia m├¡nima por fluxo

Para cada fluxo cr├¡tico registre, quando tecnicamente aplic├ível:

- SHA/release/build e ambiente;
- entidade/registro utilizado;
- passos reproduz├¡veis;
- resultado antes/depois;
- screenshot/trace de falha ou sucesso relevante;
- rede/status HTTP;
- logs/correlation ID do backend;
- persist├¬ncia ou efeito externo confirmado;
- teste automatizado correspondente;
- resultado da reexecu├º├úo contradit├│ria.

ÔÇ£N├úo encontrei erroÔÇØ sem essa trilha n├úo ├® evid├¬ncia de corre├º├úo.

## 6. Projetos sem UI

Servi├ºos API-only, workers, pipelines e automa├º├Áes devem aplicar a mesma regra usando sua interface operacional can├┤nica: endpoint real, fila, scheduler, webhook, CLI operacional ou job publicado. Mock isolado ou chamada de fun├º├úo interna n├úo substitui o caminho real de produ├º├úo-equivalente.

Valide `entrada ÔåÆ persist├¬ncia ÔåÆ processamento ÔåÆ efeito ÔåÆ confirma├º├úo ÔåÆ reconcilia├º├úo`, inclusive timeout, retry, idempot├¬ncia, duplica├º├úo, restart e falha parcial quando aplic├íveis.

## 7. AUDIT_ESCAPE ÔÇö falha descoberta depois de auditoria

Quando um usu├írio/operador encontra manualmente, ap├│s uma auditoria, um defeito que deveria ter sido detectado pelo escopo declarado:

1. registre como `AUDIT_ESCAPE`;
2. reproduza e encontre a causa funcional **e a causa do falso negativo da auditoria**;
3. identifique a **classe de falha** ausente, n├úo apenas o caso espec├¡fico;
4. procure a mesma classe em rotas, opera├º├Áes e m├│dulos equivalentes;
5. atualize o protocolo/regra global quando a lacuna for sist├¬mica;
6. reaudite a classe afetada nos demais projetos onde ela seja aplic├ível;
7. invalide qualquer certifica├º├úo incompat├¡vel com a nova evid├¬ncia at├® a revalida├º├úo.

## 8. Gate de conclus├úo

Um projeto n├úo pode receber `APTO` quando existir qualquer uma destas condi├º├Áes:

- opera├º├úo cr├¡tica n├úo executada no ambiente/release certificado;
- cobertura cr├¡tica local sem evid├¬ncia equivalente no ambiente publicado;
- `5xx`, `pageerror`, `requestfailed` ou `console.error` inesperado sem causa resolvida;
- muta├º├úo sem confirma├º├úo ap├│s reload/revisita;
- efeito externo sem confirma├º├úo/reconcilia├º├úo;
- vers├úo realmente publicada n├úo comprovada;
- ├írea cr├¡tica marcada `N├âO VALIDADO`.

O veredito deve continuar sendo `N├âO APTO` ou `APTO COM RESSALVAS` conforme risco e evid├¬ncia, nunca mascarando d├¡vida de valida├º├úo.

## 9. Reauditoria contradit├│ria

Depois das corre├º├Áes, repita os fluxos tentando quebr├í-los com outro registro/estado, edge/failure path e nova navega├º├úo. O objetivo n├úo ├® provar que o patch passa; ├® tentar provar que a conclus├úo de corre├º├úo est├í errada.

**Marker de governan├ºa:** `AUDIT_RUNTIME_PARITY_V1`
