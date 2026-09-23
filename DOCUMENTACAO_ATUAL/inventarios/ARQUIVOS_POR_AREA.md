# Arquivos por área

Cada caminho é relativo à raiz do projeto.

## Acessibilidade

Total: 3

- `src/features/accessibility/accessibility-menu.tsx`
- `src/features/accessibility/bootstrap.ts`
- `src/features/accessibility/preferences.ts`

## Administração

Total: 46

- `src/app/admin/(auth)/login/page.tsx`
- `src/app/admin/(secure)/admins/new/page.tsx`
- `src/app/admin/(secure)/admins/page.tsx`
- `src/app/admin/(secure)/apis/page.tsx`
- `src/app/admin/(secure)/audit/page.tsx`
- `src/app/admin/(secure)/author-profiles/page.tsx`
- `src/app/admin/(secure)/extensions/page.tsx`
- `src/app/admin/(secure)/flags/page.tsx`
- `src/app/admin/(secure)/guidance/page.tsx`
- `src/app/admin/(secure)/guidance/playground/page.tsx`
- `src/app/admin/(secure)/layout.tsx`
- `src/app/admin/(secure)/legal/page.tsx`
- `src/app/admin/(secure)/loading.tsx`
- `src/app/admin/(secure)/page.tsx`
- `src/app/admin/(secure)/publish/loading.tsx`
- `src/app/admin/(secure)/publish/new/page.tsx`
- `src/app/admin/(secure)/publish/page.tsx`
- `src/app/admin/(secure)/sound/page.tsx`
- `src/app/admin/(secure)/users/page.tsx`
- `src/features/admin/actions/author-profiles.ts`
- `src/features/admin/actions/create-admin.ts`
- `src/features/admin/actions/login.ts`
- `src/features/admin/actions/logout.ts`
- `src/features/admin/actions/omnipublish.ts`
- `src/features/admin/actions/product-controls.ts`
- `src/features/admin/actions/product-guidance.ts`
- `src/features/admin/actions/sound-library.ts`
- `src/features/admin/audit.ts`
- `src/features/admin/auth.ts`
- `src/features/admin/components/admin-accounts-table.tsx`
- `src/features/admin/components/admin-command-palette.tsx`
- `src/features/admin/components/admin-login-form.tsx`
- `src/features/admin/components/admin-shell.tsx`
- `src/features/admin/components/api-key-manager.tsx`
- `src/features/admin/components/audit-events-table.tsx`
- `src/features/admin/components/create-admin-form.tsx`
- `src/features/admin/components/guidance-playground.tsx`
- `src/features/admin/components/guide-code-preview.tsx`
- `src/features/admin/components/sound-upload-form.tsx`
- `src/features/admin/omnipublish/creative-composer.tsx`
- `src/features/admin/omnipublish/omnipublish-board.tsx`
- `src/features/admin/omnipublish/omnipublish-studio.tsx`
- `src/features/admin/omnipublish/render-code-page.ts`
- `src/features/admin/omnipublish/types.ts`
- `src/features/admin/rbac.ts`
- `src/features/admin/schemas/admin.ts`

## Ambiente de escrita

Total: 13

- `src/app/(writing)/layout.tsx`
- `src/app/(writing)/loading.tsx`
- `src/app/(writing)/write/[view]/page.tsx`
- `src/app/(writing)/write/page.tsx`
- `src/features/writing/components/encyclopedia-view.tsx`
- `src/features/writing/components/universe-architecture.tsx`
- `src/features/writing/components/writing-nav-icons.tsx`
- `src/features/writing/components/writing-rail.tsx`
- `src/features/writing/components/writing-studio.tsx`
- `src/features/writing/server.ts`
- `src/features/writing/spa-navigation.ts`
- `src/features/writing/types.ts`
- `src/features/writing/worldbuilding-schema.ts`

## Autenticação

Total: 29

- `src/app/(auth)/.gitkeep`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/check-email/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/update-password/page.tsx`
- `src/features/auth/.gitkeep`
- `src/features/auth/actions/login.ts`
- `src/features/auth/actions/logout.ts`
- `src/features/auth/actions/password.ts`
- `src/features/auth/actions/register.ts`
- `src/features/auth/components/account-panel.tsx`
- `src/features/auth/components/auth-brand.tsx`
- `src/features/auth/components/forgot-password-form.tsx`
- `src/features/auth/components/legal-consent-drawer.tsx`
- `src/features/auth/components/login-context.tsx`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/password-field.tsx`
- `src/features/auth/components/register-context.tsx`
- `src/features/auth/components/register-form.tsx`
- `src/features/auth/components/update-password-form.tsx`
- `src/features/auth/redirects.ts`
- `src/features/auth/schemas/login.ts`
- `src/features/auth/schemas/password.ts`
- `src/features/auth/schemas/register.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/proxy.ts`
- `src/lib/supabase/server.ts`

## Banco e infraestrutura

Total: 60

- `.env.example`
- `netlify.toml`
- `next.config.ts`
- `package.json`
- `src/proxy.ts`
- `supabase/.gitignore`
- `supabase/.temp/cli-latest`
- `supabase/.temp/gotrue-version`
- `supabase/.temp/linked-project.json`
- `supabase/.temp/pooler-url`
- `supabase/.temp/postgres-version`
- `supabase/.temp/project-ref`
- `supabase/.temp/rest-version`
- `supabase/.temp/storage-migration`
- `supabase/.temp/storage-version`
- `supabase/config.toml`
- `supabase/migrations/20260920005423_create_profiles.sql`
- `supabase/migrations/20260920030255_add_registration_profile_fields.sql`
- `supabase/migrations/20260920152224_create_admin_vault.sql`
- `supabase/migrations/20260920153534_add_registration_profile_fields.sql`
- `supabase/migrations/20260920153716_create_admin_vault.sql`
- `supabase/migrations/20260920170720_add_account_profile_fields.sql`
- `supabase/migrations/20260920170939_add_account_profile_fields.sql`
- `supabase/migrations/20260920180328_add_profile_username_and_avatar_storage.sql`
- `supabase/migrations/20260920181745_add_profile_username_and_avatar_storage.sql`
- `supabase/migrations/20260920191906_create_writing_core.sql`
- `supabase/migrations/20260920192043_create_writing_core.sql`
- `supabase/migrations/20260920194833_stabilize_writing_bootstrap.sql`
- `supabase/migrations/20260920195016_ensure_initial_writing_documents.sql`
- `supabase/migrations/20260920195954_create_library_hub.sql`
- `supabase/migrations/20260920201611_create_writing_goals.sql`
- `supabase/migrations/20260920203000_stabilize_writing_bootstrap.sql`
- `supabase/migrations/20260920204000_ensure_initial_writing_documents.sql`
- `supabase/migrations/20260920210000_create_library_hub.sql`
- `supabase/migrations/20260920220000_create_writing_goals.sql`
- `supabase/migrations/20260920230000_remove_editor_seed_placeholder.sql`
- `supabase/migrations/20260920233000_create_encyclopedia_entries.sql`
- `supabase/migrations/20260920234500_create_admin_product_controls.sql`
- `supabase/migrations/20260920235500_enforce_extension_entitlements.sql`
- `supabase/migrations/20260920235900_add_extension_marketplace_media.sql`
- `supabase/migrations/20260921234429_enrich_encyclopedia.sql`
- `supabase/migrations/20260921235946_encyclopedia_type_answers.sql`
- `supabase/migrations/20260922003402_create_media_sound.sql`
- `supabase/migrations/20260922012816_embed_media_sound_in_writing_workspace.sql`
- `supabase/migrations/20260922014215_expand_media_sound_playlists_pomodoro.sql`
- `supabase/migrations/20260922014609_allow_procedural_presets_in_playlists.sql`
- `supabase/migrations/20260922021021_expand_worldbuilding_encyclopedia.sql`
- `supabase/migrations/20260923005622_create_omnipublish_hub.sql`
- `supabase/migrations/20260923011941_expand_omnipublish_creative_studio.sql`
- `supabase/migrations/20260923014254_expand_omnipublish_catalogs_and_api.sql`
- `supabase/migrations/20260923022314_harden_omnipublish_server_tables.sql`
- `supabase/migrations/20260923023339_create_projects_universes_and_product_guidance.sql`
- `supabase/migrations/20260923030217_refine_product_guide_targets.sql`
- `supabase/migrations/20260923031000_index_projects_universes_and_guidance_foreign_keys.sql`
- `supabase/migrations/20260923031117_create_account_preferences_and_author_profiles.sql`
- `supabase/migrations/20260923033000_seed_account_preferences_guide.sql`
- `supabase/migrations/20260923034000_explicitly_deny_client_behavior_profile_access.sql`
- `supabase/migrations/20260923043000_guidance_studio_foundation_depth_and_subscriptions.sql`
- `supabase/migrations/20260923044000_harden_guidance_catalog.sql`
- `supabase/seed.sql`

## Biblioteca

Total: 10

- `src/app/(workspace)/library/[view]/page.tsx`
- `src/app/(workspace)/library/catalogs/[catalogId]/page.tsx`
- `src/app/(workspace)/library/catalogs/page.tsx`
- `src/app/(workspace)/library/page.tsx`
- `src/features/library/actions.ts`
- `src/features/library/components/library-create-dialogs.tsx`
- `src/features/library/components/library-page.tsx`
- `src/features/library/render-library.tsx`
- `src/features/library/server.ts`
- `src/features/library/types.ts`

## Conta e preferências

Total: 23

- `src/app/(workspace)/account/[section]/page.tsx`
- `src/app/(workspace)/account/extensions/page.tsx`
- `src/app/(workspace)/account/layout.tsx`
- `src/app/(workspace)/account/loading.tsx`
- `src/app/(workspace)/account/login/page.tsx`
- `src/app/(workspace)/account/page.tsx`
- `src/app/(workspace)/account/preferences/page.tsx`
- `src/app/(workspace)/account/profile/page.tsx`
- `src/features/account/actions/avatar.ts`
- `src/features/account/actions/update-login-email.ts`
- `src/features/account/actions/update-preferences.ts`
- `src/features/account/actions/update-profile.ts`
- `src/features/account/components/account-navigation.tsx`
- `src/features/account/components/avatar-editor.tsx`
- `src/features/account/components/extensions-settings.tsx`
- `src/features/account/components/login-email-settings.tsx`
- `src/features/account/components/preference-hydrator.tsx`
- `src/features/account/components/preferences-form.tsx`
- `src/features/account/components/profile-form.tsx`
- `src/features/account/navigation.ts`
- `src/features/account/preferences.ts`
- `src/features/account/schemas/login-email.ts`
- `src/features/account/schemas/profile.ts`

## Documentação

Total: 13

- `docs/ACCESSIBILITY.md`
- `docs/admin-vault.md`
- `docs/ARQUITETURA_INICIAL.md`
- `docs/AUTH.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/EDITOR.md`
- `docs/product/DESIGN.md`
- `docs/product/Documento_Interno_SaaS_Autor_Copilot_v1.md`
- `docs/STATUS_PROJETO.md`
- `NETLIFY_DEPLOY.md`
- `public/images/Aquarela_Literaria_Abas/README.md`
- `public/images/kit_marca/README.md`
- `README.md`

## Extensões

Total: 4

- `src/features/extensions/catalog.ts`
- `src/features/extensions/components/marketplace.tsx`
- `src/features/extensions/entitlements.ts`
- `src/features/extensions/mention-settings.ts`

## Guias do produto

Total: 1

- `src/features/guidance/product-guidance.tsx`

## Interface compartilhada

Total: 26

- `src/app/globals.css`
- `src/app/writing-workspace.css`
- `src/components/ui/.gitkeep`
- `src/components/ui/avatar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/collapsible.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/data-table.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/index.ts`
- `src/components/ui/input-group.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/menubar.tsx`
- `src/components/ui/pending-submit-button.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/step-flow.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/textarea.tsx`

## Legal

Total: 12

- `src/app/legal/[slug]/page.tsx`
- `src/app/legal/layout.tsx`
- `src/app/legal/loading.tsx`
- `src/app/legal/page.tsx`
- `src/components/legal/AuthorCard.tsx`
- `src/components/legal/DownloadPdfButton.tsx`
- `src/components/legal/LegalContactSection.tsx`
- `src/components/legal/LegalSidebar.tsx`
- `src/components/legal/RelatedFeatures.tsx`
- `src/components/legal/TableOfContents.tsx`
- `src/lib/legal/documents.ts`
- `src/lib/legal/server.ts`

## OmniPublish e publicação

Total: 30

- `api/.env.example`
- `api/app/__init__.py`
- `api/app/__pycache__/__init__.cpython-312.pyc`
- `api/app/__pycache__/config.cpython-312.pyc`
- `api/app/__pycache__/database.cpython-312.pyc`
- `api/app/__pycache__/main.cpython-312.pyc`
- `api/app/__pycache__/models.cpython-312.pyc`
- `api/app/__pycache__/security.cpython-312.pyc`
- `api/app/config.py`
- `api/app/database.py`
- `api/app/main.py`
- `api/app/models.py`
- `api/app/routers/__init__.py`
- `api/app/routers/__pycache__/__init__.cpython-312.pyc`
- `api/app/routers/__pycache__/campaigns.cpython-312.pyc`
- `api/app/routers/__pycache__/catalogs.cpython-312.pyc`
- `api/app/routers/__pycache__/channel_catalogs.cpython-312.pyc`
- `api/app/routers/__pycache__/publications.cpython-312.pyc`
- `api/app/routers/__pycache__/receipts.cpython-312.pyc`
- `api/app/routers/campaigns.py`
- `api/app/routers/catalogs.py`
- `api/app/routers/channel_catalogs.py`
- `api/app/routers/publications.py`
- `api/app/routers/receipts.py`
- `api/app/security.py`
- `api/Dockerfile`
- `api/README.md`
- `api/requirements.txt`
- `src/features/omnipublish/public-pages.tsx`
- `src/features/omnipublish/publications.ts`

## Outros

Total: 161

- `.env`
- `.gitignore`
- `.nvmrc`
- `components.json`
- `eslint.config.mjs`
- `iniciar-autor-copilot.sh`
- `next-env.d.ts`
- `package-lock.json`
- `postcss.config.mjs`
- `public/file.svg`
- `public/globe.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/biblioteca.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/chat-ia.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/configuracoes.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/dashboard.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/linha-do-tempo.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/notificacoes.svg`
- `public/images/Aquarela_Literaria_Abas/01_svg/personagens.svg`
- `public/images/Aquarela_Literaria_Abas/02_png/biblioteca.png`
- `public/images/Aquarela_Literaria_Abas/02_png/chat-ia.png`
- `public/images/Aquarela_Literaria_Abas/02_png/configuracoes.png`
- `public/images/Aquarela_Literaria_Abas/02_png/dashboard.png`
- `public/images/Aquarela_Literaria_Abas/02_png/linha-do-tempo.png`
- `public/images/Aquarela_Literaria_Abas/02_png/notificacoes.png`
- `public/images/Aquarela_Literaria_Abas/02_png/personagens.png`
- `public/images/Aquarela_Literaria_Abas/03_documentacao/manifest.json`
- `public/images/Aquarela_Literaria_Abas/03_documentacao/prompts.md`
- `public/images/Aquarela_Literaria_Abas/GALERIA.html`
- `public/images/Aquarela_Literaria_Abas/PREVIA.jpg`
- `public/images/favicon/apple-touch-icon.png`
- `public/images/favicon/favicon-96x96.png`
- `public/images/favicon/favicon.ico`
- `public/images/favicon/favicon.svg`
- `public/images/favicon/site.webmanifest`
- `public/images/favicon/web-app-manifest-192x192.png`
- `public/images/favicon/web-app-manifest-512x512.png`
- `public/images/kit_marca/01_ilustracoes/aventura.svg`
- `public/images/kit_marca/01_ilustracoes/escrita.svg`
- `public/images/kit_marca/01_ilustracoes/fantasia.svg`
- `public/images/kit_marca/01_ilustracoes/ficcao-cientifica.svg`
- `public/images/kit_marca/01_ilustracoes/ficcao.svg`
- `public/images/kit_marca/01_ilustracoes/misterio.svg`
- `public/images/kit_marca/01_ilustracoes/poesia.svg`
- `public/images/kit_marca/01_ilustracoes/romance.svg`
- `public/images/kit_marca/02_patterns/arcos.svg`
- `public/images/kit_marca/02_patterns/constelacoes.svg`
- `public/images/kit_marca/02_patterns/folhas-soltas.svg`
- `public/images/kit_marca/02_patterns/linhas-editoriais.svg`
- `public/images/kit_marca/02_patterns/livros-abertos.svg`
- `public/images/kit_marca/02_patterns/ondas-de-tinta.svg`
- `public/images/kit_marca/02_patterns/pontos-organicos.svg`
- `public/images/kit_marca/02_patterns/ramos.svg`
- `public/images/kit_marca/03_backgrounds/cantos-botanicos.svg`
- `public/images/kit_marca/03_backgrounds/floresta-noturna.svg`
- `public/images/kit_marca/03_backgrounds/halo-salvia.svg`
- `public/images/kit_marca/03_backgrounds/margem-manuscrito.svg`
- `public/images/kit_marca/03_backgrounds/nevoa-verde.svg`
- `public/images/kit_marca/03_backgrounds/papel-claro.svg`
- `public/images/kit_marca/04_texturas/grao-salvia.svg`
- `public/images/kit_marca/04_texturas/papel-fibras.svg`
- `public/images/kit_marca/04_texturas/pigmento-floresta.svg`
- `public/images/kit_marca/04_texturas/poeira-editorial.svg`
- `public/images/kit_marca/05_ornamentos/aspas-editoriais.svg`
- `public/images/kit_marca/05_ornamentos/divisor-capitulo.svg`
- `public/images/kit_marca/05_ornamentos/divisor-ramo.svg`
- `public/images/kit_marca/05_ornamentos/marcador-pagina.svg`
- `public/images/kit_marca/06_originais_png/aventura.png`
- `public/images/kit_marca/06_originais_png/escrita.png`
- `public/images/kit_marca/06_originais_png/fantasia.png`
- `public/images/kit_marca/06_originais_png/ficcao-cientifica.png`
- `public/images/kit_marca/06_originais_png/ficcao.png`
- `public/images/kit_marca/06_originais_png/misterio.png`
- `public/images/kit_marca/06_originais_png/poesia.png`
- `public/images/kit_marca/06_originais_png/romance.png`
- `public/images/kit_marca/07_documentacao/GUIA_USO.md`
- `public/images/kit_marca/07_documentacao/manifest.json`
- `public/images/kit_marca/07_documentacao/paleta.json`
- `public/images/kit_marca/07_documentacao/prompts.md`
- `public/images/kit_marca/07_documentacao/VALIDACAO.md`
- `public/images/kit_marca/GALERIA.html`
- `public/images/kit_marca/PREVIA_ILUSTRACOES.jpg`
- `public/images/logos/isologo-color-bgdark.svg`
- `public/images/logos/isologo-color-bgwhite.svg`
- `public/images/logos/isologo-dark.svg`
- `public/images/logos/isologo-white.svg`
- `public/images/logos/logotipo-dark.svg`
- `public/images/logos/logotipo-white.svg`
- `public/images/texture/texturacapadelivro.jpg`
- `public/legal/pdfs/cancelamento-reembolso.pdf`
- `public/legal/pdfs/cookies.pdf`
- `public/legal/pdfs/direitos-autorais.pdf`
- `public/legal/pdfs/dpa.pdf`
- `public/legal/pdfs/privacidade.pdf`
- `public/legal/pdfs/termos-de-uso.pdf`
- `public/legal/pdfs/uso-aceitavel.pdf`
- `public/legal/pdfs/uso-de-ia.pdf`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`
- `render.yaml`
- `scaffold-legal-pages.js`
- `scripts/create-master-admin.mjs`
- `scripts/generate-project-documentation.py`
- `src/app/(onboarding)/onboarding/page.tsx`
- `src/app/(site)/.gitkeep`
- `src/app/(workspace)/.gitkeep`
- `src/app/(workspace)/dashboard/page.tsx`
- `src/app/(workspace)/layout.tsx`
- `src/app/(workspace)/loading.tsx`
- `src/app/(workspace)/sound/page.tsx`
- `src/app/ajuda/[slug]/page.tsx`
- `src/app/ajuda/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/book-flip.css`
- `src/app/comunicados/[slug]/page.tsx`
- `src/app/comunicados/page.tsx`
- `src/app/favicon.ico`
- `src/app/layout.tsx`
- `src/app/loading.tsx`
- `src/app/newsletters/[slug]/page.tsx`
- `src/app/newsletters/page.tsx`
- `src/app/page.module.css`
- `src/app/page.tsx`
- `src/app/publicacoes/page.tsx`
- `src/app/status/[slug]/page.tsx`
- `src/app/status/page.tsx`
- `src/app/updates/[id]/page.tsx`
- `src/app/updates/page.tsx`
- `src/components/editor/.gitkeep`
- `src/components/layout/.gitkeep`
- `src/components/navigation-progress.tsx`
- `src/config/env.ts`
- `src/features/analysis/.gitkeep`
- `src/features/characters/.gitkeep`
- `src/features/manuscript/.gitkeep`
- `src/features/onboarding/actions/.gitkeep`
- `src/features/onboarding/actions/complete-profile.ts`
- `src/features/onboarding/components/.gitkeep`
- `src/features/onboarding/components/profile-form.tsx`
- `src/features/onboarding/schemas/.gitkeep`
- `src/features/onboarding/schemas/profile.ts`
- `src/features/projects/.gitkeep`
- `src/features/timeline/.gitkeep`
- `src/features/workspace/components/operational-tag.tsx`
- `src/features/workspace/components/workspace-header.tsx`
- `src/features/workspace/components/workspace-shell.tsx`
- `src/features/workspace/components/workspace-sidebar.tsx`
- `src/features/workspace/navigation.ts`
- `src/hooks/.gitkeep`
- `src/lib/brand-image.ts`
- `src/lib/cn.ts`
- `src/lib/favicon-image.ts`
- `src/lib/utils.ts`
- `src/styles/.gitkeep`
- `src/types/.gitkeep`
- `src/types/database.generated.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `tsconfig.tsbuildinfo`

## Som e mídia

Total: 11

- `src/features/sound/components/audio-review-drawer.tsx`
- `src/features/sound/components/sound-binder-footer.tsx`
- `src/features/sound/components/sound-dock.tsx`
- `src/features/sound/components/sound-mega-menu.tsx`
- `src/features/sound/components/sound-playlists-panel.tsx`
- `src/features/sound/components/sound-pomodoro-panel.tsx`
- `src/features/sound/components/sound-settings-panel.tsx`
- `src/features/sound/presets.ts`
- `src/features/sound/server.ts`
- `src/features/sound/sound-provider.tsx`
- `src/features/sound/types.ts`

## Visão geral

Total: 8

- `src/app/(workspace)/overview/[view]/page.tsx`
- `src/app/(workspace)/overview/page.tsx`
- `src/features/overview/actions.ts`
- `src/features/overview/components/new-goal-dialog.tsx`
- `src/features/overview/components/overview-page.tsx`
- `src/features/overview/render-overview.tsx`
- `src/features/overview/server.ts`
- `src/features/overview/types.ts`
