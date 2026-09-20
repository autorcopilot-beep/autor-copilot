# Autor Copilot

Aplicação web para escrever, planejar e organizar histórias. O projeto usa
Next.js 16, React 19, TypeScript, Tailwind CSS e Supabase.

## Requisitos

- Node.js 20.9 ou superior
- npm
- Docker Desktop, apenas para executar o Supabase local completo

## Primeira execução

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. A página pública funciona sem Supabase; as futuras
rotas de conta exigirão as variáveis de `.env.local`.

## Supabase local

Com o Docker Desktop em execução:

```bash
npm run db:start
```

O comando apresenta as credenciais locais e inicia o Studio. Copie a URL e a
publishable key para `.env.local`. Comandos úteis:

```bash
npm run db:reset
npm run db:types
npm run db:stop
```

Não adicione secret keys, `service_role` ou `.env.local` ao repositório.

### Projeto remoto e confirmação de e-mail

Defina `NEXT_PUBLIC_SITE_URL` com a origem da aplicação (por exemplo,
`http://localhost:3000`). No painel do Supabase, adicione também
`http://localhost:3000/auth/callback` às URLs de redirecionamento permitidas
durante o desenvolvimento.

Depois de vincular o CLI ao projeto correto, aplique as migrations versionadas:

```bash
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

O cadastro e a recuperação de senha usam e-mail. Para produção, configure SMTP
próprio no Supabase; o serviço padrão é destinado a testes e possui limites
baixos.

## Fluxos de conta

- `/register`: cria a conta e solicita confirmação de e-mail.
- `/login`: inicia uma sessão com e-mail e senha.
- `/forgot-password`: envia um link de recuperação sem revelar se a conta existe.
- `/update-password`: valida a sessão de recuperação e troca a senha.
- `/onboarding`: completa o perfil de escrita antes do workspace.
- `/dashboard`: rota privada inicial do autor.

Consulte [docs/AUTH.md](docs/AUTH.md) para os redirecionamentos, limites de
segurança e roteiro de teste manual.

## Qualidade

```bash
npm run lint
npm run typecheck
npm run build
# ou execute todos:
npm run check
```

Consulte [docs/ARQUITETURA_INICIAL.md](docs/ARQUITETURA_INICIAL.md) para os
limites entre rotas, funcionalidades e infraestrutura. Os tokens, componentes
e regras visuais estão em [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
As preferências de leitura e acessibilidade estão descritas em
[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).
