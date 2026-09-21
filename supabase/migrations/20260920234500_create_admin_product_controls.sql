create table public.user_access_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'suspended', 'restricted')),
  groups text[] not null default array['free']::text[],
  tags text[] not null default '{}',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

create table public.extension_catalog (
  id text primary key,
  name text not null,
  version text not null default '1.0.0',
  product_kind text not null default 'extension' check (product_kind in ('extension', 'plugin', 'connector')),
  category text not null check (category in ('editor', 'narrative', 'connectors', 'styling')),
  description text not null,
  author text not null default 'Autor Copilot Lab',
  price_model text not null default 'free' check (price_model in ('free', 'one_time', 'subscription', 'pro_included')),
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'BRL' check (char_length(currency) = 3),
  allowed_groups text[] not null default array['free', 'pro', 'beta']::text[],
  tags text[] not null default '{}',
  feature_flag text,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  media_url text not null default '',
  media_type text not null default 'none' check (media_type in ('none', 'gif', 'mp4')),
  config jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_extension_installations (
  user_id uuid not null references auth.users (id) on delete cascade,
  extension_id text not null references public.extension_catalog (id) on delete cascade,
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  installed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, extension_id)
);

create table public.feature_flags (
  key text primary key,
  name text not null,
  description text not null default '',
  enabled boolean not null default false,
  rollout_percentage integer not null default 0 check (rollout_percentage between 0 and 100),
  allowed_groups text[] not null default '{}',
  tags text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.legal_documents (
  slug text primary key,
  title text not null,
  short_description text not null default '',
  department text not null default 'Jurídico & Produto',
  version text not null default '1.0',
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  related_features text[] not null default '{}',
  pdf_href text not null default '',
  is_published boolean not null default false,
  effective_at date not null default current_date,
  updated_at timestamptz not null default now()
);

create index extension_catalog_discovery_idx on public.extension_catalog (is_published, category, is_featured desc);
create index user_extension_installations_user_idx on public.user_extension_installations (user_id, is_active);
create index user_access_profiles_groups_idx on public.user_access_profiles using gin (groups);

alter table public.user_access_profiles enable row level security;
alter table public.extension_catalog enable row level security;
alter table public.user_extension_installations enable row level security;
alter table public.feature_flags enable row level security;
alter table public.legal_documents enable row level security;

revoke all on table public.user_access_profiles, public.extension_catalog, public.user_extension_installations, public.feature_flags, public.legal_documents from anon, authenticated;
grant select on table public.extension_catalog, public.feature_flags to authenticated;
grant select on table public.legal_documents to anon, authenticated;
grant select on table public.user_access_profiles to authenticated;
grant select, insert, update, delete on table public.user_extension_installations to authenticated;

create policy "Published extensions are visible to signed in users" on public.extension_catalog for select to authenticated using (is_published);
create policy "Users can read their access profile" on public.user_access_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can read feature flags" on public.feature_flags for select to authenticated using (true);
create policy "Published legal documents are public" on public.legal_documents for select to anon, authenticated using (is_published);
create policy "Users can read their extension installations" on public.user_extension_installations for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can install allowed extensions" on public.user_extension_installations for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.extension_catalog as extension
      where extension.id = extension_id
        and extension.is_published
        and extension.allowed_groups && coalesce(
          (select access.groups from public.user_access_profiles as access where access.user_id = (select auth.uid())),
          array['free']::text[]
        )
    )
  );
create policy "Users can update their extension installations" on public.user_extension_installations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.extension_catalog as extension
      where extension.id = extension_id
        and extension.is_published
        and extension.allowed_groups && coalesce(
          (select access.groups from public.user_access_profiles as access where access.user_id = (select auth.uid())),
          array['free']::text[]
        )
    )
  );
create policy "Users can uninstall their extensions" on public.user_extension_installations for delete to authenticated using ((select auth.uid()) = user_id);

create trigger user_access_profiles_set_updated_at before update on public.user_access_profiles for each row execute procedure private.set_updated_at();
create trigger extension_catalog_set_updated_at before update on public.extension_catalog for each row execute procedure private.set_updated_at();
create trigger user_extension_installations_set_updated_at before update on public.user_extension_installations for each row execute procedure private.set_updated_at();
create trigger feature_flags_set_updated_at before update on public.feature_flags for each row execute procedure private.set_updated_at();
create trigger legal_documents_set_updated_at before update on public.legal_documents for each row execute procedure private.set_updated_at();

insert into public.extension_catalog (id, name, category, description, tags, is_featured, feature_flag, config) values
  ('lab.context-mentions', 'Contexto por @', 'editor', 'Vincula personagens e elementos da Enciclopédia diretamente ao manuscrito.', array['Enciclopédia', 'Contexto', 'PT-BR'], true, 'extensions.context_mentions', '{"performanceBudgetMs":2,"runsLocallyOnly":true}'),
  ('lab.immersive-focus', 'Foco Imersivo', 'styling', 'Remove painéis e controles para manter somente o texto no centro da sessão.', array['Foco', 'Editor'], true, 'extensions.immersive_focus', '{"performanceBudgetMs":1,"runsLocallyOnly":true}'),
  ('lab.typewriter-mode', 'Modo Máquina de Escrever', 'editor', 'Mantém a linha atual próxima ao centro da tela durante a digitação.', array['Foco', 'Acessibilidade'], false, 'extensions.typewriter_mode', '{"performanceBudgetMs":2,"runsLocallyOnly":true}'),
  ('lab.manuscript-metrics', 'Métricas do Manuscrito', 'narrative', 'Mostra palavras, caracteres, metas e referências do capítulo em tempo real.', array['Métricas', 'Produtividade'], true, 'extensions.manuscript_metrics', '{"performanceBudgetMs":3,"runsLocallyOnly":true}'),
  ('lab.reference-guardian', 'Guardião de Referências', 'narrative', 'Detecta vínculos quebrados e resume entidades citadas por tipo.', array['Continuidade', 'Revisão'], false, 'extensions.reference_guardian', '{"performanceBudgetMs":4,"runsLocallyOnly":true}');

insert into public.feature_flags (key, name, description, enabled, rollout_percentage, allowed_groups, tags) values
  ('extensions.context_mentions', 'Contexto por @', 'Libera menções vinculadas à Enciclopédia.', true, 100, array['free', 'pro', 'beta'], array['extensions', 'editor']),
  ('extensions.immersive_focus', 'Foco Imersivo', 'Libera o modo de escrita sem distrações.', true, 100, array['free', 'pro', 'beta'], array['extensions', 'editor']),
  ('extensions.typewriter_mode', 'Modo Máquina de Escrever', 'Libera centralização automática da linha ativa.', true, 100, array['free', 'pro', 'beta'], array['extensions', 'editor']),
  ('extensions.manuscript_metrics', 'Métricas do Manuscrito', 'Libera métricas editoriais em tempo real.', true, 100, array['free', 'pro', 'beta'], array['extensions', 'metrics']),
  ('extensions.reference_guardian', 'Guardião de Referências', 'Libera verificação de referências órfãs.', true, 100, array['free', 'pro', 'beta'], array['extensions', 'continuity']);
