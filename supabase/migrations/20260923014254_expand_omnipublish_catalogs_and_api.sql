create table public.communication_catalogs (
  channel text primary key check (channel in ('email','legal','changelog','knowledge','in_app','status','blog')),
  name text not null,
  description text not null default '',
  public_base_path text not null unique check (public_base_path ~ '^/[a-z0-9/_-]*$'),
  api_collection_path text not null unique check (api_collection_path ~ '^/v1/[a-z0-9/_-]*$'),
  icon_name text not null default 'file-text',
  accent_color text not null default '#356b55',
  is_public boolean not null default true,
  supports_canvas boolean not null default true,
  display_order integer not null default 0,
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.communication_catalogs
  (channel, name, description, public_base_path, api_collection_path, icon_name, accent_color, display_order, settings)
values
  ('email', 'Cartas e newsletters', 'Arquivo público das comunicações editoriais enviadas por e-mail.', '/newsletters', '/v1/newsletters', 'mail', '#3d6e8c', 10, '{"eyebrow":"Cartas do Autor Copilot"}'),
  ('legal', 'Documentos legais', 'Termos, políticas e acordos vigentes.', '/legal', '/v1/legal', 'scale', '#b8863b', 20, '{"eyebrow":"Governança e transparência"}'),
  ('changelog', 'Changelog', 'Versões, melhorias, correções e mudanças de produto.', '/updates', '/v1/updates', 'rocket', '#356b55', 30, '{"eyebrow":"Evolução do produto"}'),
  ('knowledge', 'Central de ajuda', 'Guias e respostas para usar melhor o Autor Copilot.', '/ajuda', '/v1/knowledge', 'book-open', '#675b9a', 40, '{"eyebrow":"Conhecimento prático"}'),
  ('in_app', 'Comunicados', 'Avisos e mensagens públicas do produto.', '/comunicados', '/v1/announcements', 'megaphone', '#8b5e3c', 50, '{"eyebrow":"Comunicados oficiais"}'),
  ('status', 'Status dos serviços', 'Incidentes, manutenções e histórico operacional.', '/status', '/v1/status', 'activity', '#b84b4b', 60, '{"eyebrow":"Operação em tempo real"}'),
  ('blog', 'Revista Autor Copilot', 'Artigos, ensaios e histórias sobre o ofício da escrita.', '/blog', '/v1/blog', 'newspaper', '#4e725a', 70, '{"eyebrow":"Ideias para quem escreve"}');

alter table public.communication_items
  add column public_path text,
  add column is_public boolean not null default true,
  add column seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object');

update public.communication_items
set slug = trim(both '-' from regexp_replace(
  translate(lower(title), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn'),
  '[^a-z0-9]+', '-', 'g'
))
where slug = '';

update public.communication_items
set public_path = case channel
  when 'email' then '/newsletters/' || slug
  when 'legal' then '/legal/' || slug
  when 'changelog' then '/updates/' || slug
  when 'knowledge' then '/ajuda/' || slug
  when 'in_app' then '/comunicados/' || slug
  when 'status' then '/status/' || slug
  when 'blog' then '/blog/' || slug
end;

create unique index communication_items_public_path_unique_idx
  on public.communication_items (public_path)
  where public_path is not null;
create index communication_items_public_catalog_idx
  on public.communication_items (channel, is_public, published_at desc)
  where status = 'published';

create table public.communication_api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  key_prefix text not null unique,
  key_hash text not null unique,
  scopes text[] not null default array['catalogs:read','publications:read']::text[],
  status text not null default 'active' check (status in ('active','revoked')),
  expires_at timestamptz,
  last_used_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index communication_api_keys_status_idx on public.communication_api_keys (status, expires_at);

alter table public.communication_catalogs enable row level security;
alter table public.communication_api_keys enable row level security;

revoke all on table public.communication_catalogs, public.communication_api_keys from anon, authenticated;
grant select on table public.communication_catalogs to anon, authenticated;

create policy "Public catalogs are readable"
  on public.communication_catalogs for select to anon, authenticated
  using (is_public);

create trigger communication_catalogs_set_updated_at before update on public.communication_catalogs
  for each row execute procedure private.set_updated_at();

comment on table public.communication_catalogs is 'Registry of OmniPublish channels, public catalogs and API collection endpoints.';
comment on table public.communication_api_keys is 'Hashed FastAPI credentials. Plaintext keys are displayed only once at creation.';
comment on column public.communication_items.public_path is 'Canonical deep link for a public publication.';
