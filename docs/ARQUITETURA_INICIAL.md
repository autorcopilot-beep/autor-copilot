# Autor Copilot — arquitetura inicial

## Objetivo desta fase

A fase 1 estabelece os limites do projeto, a integração-base com Supabase e o
ambiente de desenvolvimento. Ela não implementa páginas, formulários ou fluxos
de autenticação.

## Estrutura

```text
src/
├── app/                    # Rotas e layouts do Next.js App Router
│   ├── (site)/             # Conteúdo público e institucional
│   ├── (auth)/             # Login, cadastro e recuperação de senha
│   ├── (onboarding)/       # Configuração inicial após o cadastro
│   └── (workspace)/        # Área autenticada do escritor
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

## Próximas fases

1. **Concluída nesta entrega:** fundação, pastas e Supabase.
2. **Concluída:** design system, tokens e componentes-base.
3. **Concluída:** preferências e controles de acessibilidade.
4. **Concluída:** cadastro funcional, perfil protegido e confirmação de e-mail.
5. **Concluída:** login, onboarding, recuperação de senha e proteção do workspace.
