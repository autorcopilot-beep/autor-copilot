# God Mode — The Vault

## Estado atual

Os Steps 1 e 2 estão concluídos. O Admin Center já possui:

- login e logout próprios, sem cadastro público;
- conta Master criada por script isolado e idempotente;
- criação de novos administradores exclusiva do Master;
- RBAC com papéis e permissões granulares;
- auditoria append-only para ações administrativas;
- proteção de rotas e RLS;
- identificação visual de produção, staging e ambiente local;
- Command Palette com comandos filtrados por permissão;
- tabelas de alta densidade com busca fuzzy, ordenação, paginação e
  carregamento incremental;
- telas de administradores e trilha de auditoria.

O Step 3 também está implementado com:

- gestão de usuários, status, grupos e tags;
- catálogo oficial de extensões com preço, publicação e elegibilidade;
- feature flags com rollout percentual e segmentos;
- documentos legais versionados, editáveis e publicáveis;
- marketplace do Autor Copilot Lab ligado aos controles administrativos.

Manutenção, observabilidade e hardening avançado continuam planejados para os
Steps 4 a 7.

## Configuração do servidor

O Admin Center usa a chave secreta apenas no servidor. Configure:

```dotenv
SUPABASE_SECRET_KEY=sb_secret_...
```

Projetos locais antigos também podem usar `SUPABASE_SERVICE_ROLE_KEY`. Nunca use o prefixo
`NEXT_PUBLIC_` para essas chaves.

## Aplicação da migration

```bash
npx supabase db push
```

A migration cria `admin_accounts`, `admin_audit_logs`, os papéis administrativos, RLS e a
proteção append-only da auditoria.

Ela já foi aplicada ao projeto remoto atual.

## Criação isolada do primeiro Master

Defina as variáveis somente no terminal ou em um arquivo local ignorado pelo Git:

```dotenv
MASTER_ADMIN_EMAIL=admin@empresa.com
MASTER_ADMIN_PASSWORD=uma-senha-forte-com-12-caracteres
MASTER_ADMIN_NAME=Nome do responsável
```

Depois execute:

```bash
npm run admin:create-master
```

O script é idempotente: cria ou reconcilia a identidade Master e registra o evento na auditoria.
Novos administradores devem ser convidados exclusivamente em `/admin/admins/new`.

## Segurança operacional

- A chave secreta fica somente no servidor.
- Toda autorização é repetida no servidor; ocultar um item da interface não
  concede nem revoga permissão.
- Logs de auditoria não podem ser alterados ou removidos pelas contas
  administrativas.
- Produção ainda deve ativar MFA, whitelist de IP e proteção contra senhas
  vazadas durante o Step 7.
