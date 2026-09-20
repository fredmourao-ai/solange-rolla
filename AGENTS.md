# AGENTS.md


<!-- SUPERPOWERS_EVERY_STAGE_V1 -->
> **@Superpowers CONTÍNUO E OBRIGATÓRIO:** toda conversa, sessão, agente e retomada de tarefa destes projetos deve usar @Superpowers **em cada etapa material**, não apenas no início. Reaplique a disciplina adequada ao passar por bootstrap/contexto, planejamento, investigação, coleta de evidências, implementação, debugging, TDD/testes, revisão, correção, PR/checks/merge, deploy, pós-deploy, auditoria e encerramento. Em `retome/continue/prossiga`, continue do último checkpoint comprovado sob @Superpowers. Se o runtime não expuser @Superpowers, registre `SUPERPOWERS_UNAVAILABLE` e aplique a metodologia equivalente sem fingir a chamada. Subagentes e automações delegadas herdam esta obrigação. Fonte local: `REGRAS-AGENTES-CENTRALIZADAS.md`; fonte canônica global: `Vivaliz-site/site-shopvivaliz`.

Leitura obrigatoria para qualquer agente que trabalhe neste repositorio.

## Acesso a infraestrutura

Antes de executar comandos nas VMs Oracle Cloud da ShopVivaliz, leia e siga [`AGENTS-VM-ACCESS.md`](AGENTS-VM-ACCESS.md).

Regras essenciais:
- usar somente o perfil OCI `AGENTS` para operacoes de agentes;
- nunca versionar chaves privadas, tokens ou senhas;
- validar execucao real por estado terminal, stdout e exit code;
- nao presumir privilegio root no OCI Run Command;
- nao usar `StrictHostKeyChecking=no` em SSH.

## Isolamento obrigatorio de sessao CLI por chat

Antes de qualquer operacao em terminal/CLI, leia e cumpra a secao `Isolamento obrigatorio de sessao CLI por chat` de `AI-TO-CLI-PROTOCOL.md`. Cada chat deve usar sessao/namespace CLI exclusivo; reutilizacao de sessao entre chats e proibida. Estado necessario para retomada deve ser persistido fora da memoria do shell.
Regra de continuidade: leia e cumpra `AI-TO-CLI-PROTOCOL.md`, especialmente `Continuidade obrigatoria diante de falha de ferramenta ou comando`; erro de ferramenta nao autoriza encerrar a tarefa.

## Continuidade obrigatoria
Todo agente deve cumprir o `PROTOCOLO OBRIGATORIO DE CONCLUSAO DE TAREFAS` em `AI-TO-CLI-PROTOCOL.md`; erro de ferramenta ou resultado parcial nunca e motivo para parar.

<!-- EXECUTION_PROVENANCE_POLICY_V1 -->
## Assinatura e origem obrigatorias de toda execucao

Antes de qualquer acao material, leia e cumpra EXECUTION-PROVENANCE-POLICY.md. Toda execucao automatizada ou operacional deve carregar identidade, origem e execution_id verificaveis; recursos temporarios devem ter owner/origin e cleanup. Use scripts/emit-execution-provenance.py como formato de referencia. Nunca registre secrets.


<!-- BROWSER_SESSION_POLICY_V1 -->
## Navegador: escolha de host e cleanup obrigatorio
Antes de browser interativo/remoto, se o host nao estiver explicitamente definido na tarefa, pergunte qual maquina usar. Sessoes invisiveis/headless transitorias devem ter ownership + TTL padrao de 2h renovavel por heartbeat e cleanup ao final/boot. Orfaos podem ser limpos antes; sessoes visiveis e bridges persistentes documentadas devem ser preservadas. Nunca matar navegador globalmente por nome de processo. Leia a politica completa em `REGRAS-AGENTES-CENTRALIZADAS.md` (BROWSER_SESSION_POLICY_V1).
