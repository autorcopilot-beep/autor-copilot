# Site público

## Rotas

Início `/`; produto `/funcionalidades`, `/como-funciona`, `/demo`, `/precos`, `/faq`; recursos `/guias`, `/documentacao`, `/comunidade`; empresa `/sobre`, `/contato`, `/carreiras`, `/imprensa`, `/roadmap`; privacidade `/cookies`.

Os catálogos existentes `/blog`, `/ajuda`, `/updates`, `/status`, `/publicacoes`, `/comunicados`, `/newsletters` e `/legal` usam a mesma navegação e rodapé. Seu conteúdo continua vindo do fluxo de publicação existente.

O layout público é selecionado por rotas em `src/features/public-site/public-shell.tsx`. As áreas autenticadas preservam seus próprios layouts. O catálogo estático está em `catalog.ts`; as páginas são geradas por `(public)/[publicPage]/page.tsx`.

## Conteúdo e lançamento

A demonstração usa dados ilustrativos, explicitamente identificados, e não altera obras. Não há depoimentos, downloads, audiência ou contadores inventados. Os quatro preços do plano enviado aparecem como proposta de lançamento, com simulação mensal/anual, sem checkout. Validar as condições comerciais antes de apresentá-los como contratação disponível.

O site não publica contato ou redes sociais inventados. Os links levam aos canais internos existentes. Newsletters são acessadas pelo catálogo de edições, sem formulário que simule inscrição.

## Consentimento

`ac_cookie_consent` armazena versão, categorias e data por 180 dias, com `SameSite=Lax`, `Path=/` e `Secure` em HTTPS. A ausência, expiração, versão antiga ou registro inválido bloqueia opcionais. O localStorage `ac:consent-sync` contém apenas o timestamp para sincronização entre abas.

O painel permite aceitar tudo, recusar opcionais ou salvar categorias separadas. Pode ser reaberto pelo rodapé ou `/cookies`. Alterações disparam `ac:consent-changed`. Autenticação e preferências explicitamente solicitadas no produto não são removidas ao recusar marketing.

Nenhum provedor de analytics ou pixel foi configurado. Novas integrações devem ser montadas dentro de `ConsentGate`, com a categoria correspondente, e limpar seus próprios cookies e recursos no desmontar. Não inserir scripts opcionais diretamente no layout. A revogação desmonta o conteúdo protegido. Publicações com HTML/JS customizados são protegidas pela categoria de mídia externa e mantêm iframe sandbox sem mesma origem.

Inventário visível em `/cookies`. Atualizar inventário e incrementar `CONSENT_VERSION` quando finalidades relevantes mudarem. Este mecanismo registra a decisão no navegador, não cria histórico de auditoria no servidor.

## SEO e verificações

Metadados por página, imagem Open Graph, `robots.txt` e `sitemap.xml`. Configure `NEXT_PUBLIC_SITE_URL` com a URL real de produção para o sitemap. Sem esse valor, não são inventadas URLs indexáveis.

Executar `node --test scripts/test-cookie-consent.cjs`, `npm run typecheck`, `npm run lint` e `npm run build`. Verificar menu por teclado, consentimento após recarregar, recusa, edição, navegação mobile e layout a 390px.
