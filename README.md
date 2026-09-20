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
