# Autor Copilot — arquitetura inicial

## Objetivo e estado atual

A arquitetura começou como a fundação do projeto e hoje sustenta os fluxos
funcionais de autenticação, onboarding, dashboard, configurações de conta e o
Admin Center. Este documento registra os limites entre as camadas; o estado
detalhado das entregas fica em [STATUS_PROJETO.md](STATUS_PROJETO.md).

## Estrutura

```text
src/
├── app/                    # Rotas e layouts do Next.js App Router
│   ├── (site)/             # Conteúdo público e institucional
│   ├── (auth)/             # Login, cadastro e recuperação de senha
│   ├── (onboarding)/       # Configuração inicial após o cadastro
│   ├── (writing)/          # Editor protegido com layout próprio
│   └── (workspace)/        # Dashboard e configurações autenticadas da conta
├── components/             # Componentes compartilhados de UI, layout e editor
├── config/                 # Configuração tipada da aplicação
├── features/               # Casos de uso agrupados por domínio
├── hooks/                  # Hooks compartilhados entre funcionalidades
├── lib/                    # Adaptadores de infraestrutura e integrações
│   └── supabase/           # Clientes separados para navegador e servidor
├── styles/                 # Estilos compartilhados futuros
└── types/                  # Contratos globais e tipos gerados do banco

supabase/
├── config.toml             # Configuração do ambiente Supabase local
├── migrations/             # Histórico versionado do esquema PostgreSQL
└── seed.sql                # Dados repetíveis apenas para desenvolvimento
```

Os grupos entre parênteses organizam o código sem alterar a URL. As rotas
`/login`, `/register`, `/forgot-password`, `/update-password`, `/onboarding` e
`/dashboard` seguem essa organização sem expor os nomes dos grupos na URL.

## Regras de dependência

1. `app` compõe páginas e chama funcionalidades; regras de negócio não devem
   ficar nos arquivos de rota.
2. `features` contém ações, componentes e validações específicas de cada
   domínio. Uma feature não acessa arquivos internos de outra feature.
3. `components` contém apenas elementos realmente compartilhados.
4. `lib` adapta serviços externos. Componentes não criam clientes Supabase
   diretamente fora dos helpers em `lib/supabase`.
5. Segredos nunca usam o prefixo `NEXT_PUBLIC_` e nunca são enviados ao Git.
6. Toda tabela exposta precisa de Row Level Security antes de ser usada pela
   aplicação.

## Supabase

- `client.ts`: cliente para Client Components.
- `server.ts`: cliente para Server Components, Server Actions e Route Handlers.
- `database.generated.ts`: contrato temporário; será regenerado pelas migrations
  com `npm run db:types`.
- O Proxy do Next.js 16 renova cookies somente nas rotas que dependem de sessão.
- Páginas protegidas validam a identidade com `auth.getClaims()` no servidor.
- Redirecionamentos pós-autenticação aceitam apenas destinos internos permitidos.

## Evolução concluída sobre a fundação

1. Fundação, organização de pastas e integração com Supabase.
2. Design system, shadcn/ui, tokens e componentes compartilhados.
3. Preferências e controles de acessibilidade.
4. Cadastro em etapas, perfil protegido e confirmação de e-mail.
5. Login, onboarding, recuperação de senha e proteção do workspace.
6. Dashboard editorial com navegação responsiva.
7. Central da conta com perfil, nome de usuário, avatar privado e troca de
   e-mail.
8. Admin Center com identidade administrativa, RBAC, auditoria, navegação,
   Command Palette e tabelas de alta densidade.
9. Primeira versão local-first do editor com capítulos, formatação, metas,
   instantâneos e exportação Markdown.
