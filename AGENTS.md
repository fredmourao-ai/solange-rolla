# AGENTS.md

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
