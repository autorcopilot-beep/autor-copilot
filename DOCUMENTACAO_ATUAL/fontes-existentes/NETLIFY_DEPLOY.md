# Deploy na Netlify

O projeto usa Next.js App Router, SSR, Server Actions, middleware e otimização de imagens. A Netlify detecta o Next.js e aplica automaticamente o adaptador OpenNext; não fixe `@netlify/plugin-nextjs` no `package.json`.

## Primeiro deploy

1. Envie o repositório para GitHub, GitLab ou Bitbucket.
2. Na Netlify, escolha **Add new project** e importe o repositório.
3. Confirme o comando `npm run build` e o diretório publicado `.next`. Ambos já estão definidos em `netlify.toml`.
4. Cadastre, em **Project configuration → Environment variables**, todas as variáveis listadas em `.env.example`.
5. Use a URL definitiva da Netlify em `NEXT_PUBLIC_SITE_URL` e faça um novo deploy se essa URL mudar.
6. No Supabase, adicione `https://SEU-SITE.netlify.app/auth/callback` às URLs de redirecionamento permitidas da autenticação.

Nunca envie `.env`, `SUPABASE_SECRET_KEY` ou a senha do administrador para o Git. A chave secreta deve existir apenas nas variáveis protegidas da Netlify.

## Validação local

```powershell
npm run typecheck
npm run lint
npm run build
```

Documentação oficial: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
