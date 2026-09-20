create type public.library_work_status as enum (
  'planning',
  'drafting',
  'revising',
  'complete'
);

alter table public.works
  add column subtitle text not null default '',
  add column synopsis text not null default '',
  add column genre text not null default 'Não definido',
  add column status public.library_work_status not null default 'drafting',
  add column is_favorite boolean not null default false,
  add column archived_at timestamptz,
  add column word_goal integer not null default 50000,
  add column cover_tone text not null default 'sage';

alter table public.works
  add constraint works_subtitle_length check (char_length(subtitle) <= 200),
  add constraint works_synopsis_length check (char_length(synopsis) <= 5000),
  add constraint works_genre_length check (char_length(genre) between 1 and 80),
  add constraint works_word_goal_range check (word_goal between 0 and 10000000),
  add constraint works_cover_tone_check check (
    cover_tone in ('sage', 'ink', 'clay', 'ochre', 'plum', 'ocean')
  );

create table public.library_catalogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text not null default '',
  color text not null default 'sage',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint library_catalogs_name_length check (char_length(btrim(name)) between 1 and 80),
  constraint library_catalogs_description_length check (char_length(description) <= 500),
  constraint library_catalogs_color_check check (
    color in ('sage', 'ink', 'clay', 'ochre', 'plum', 'ocean')
  ),
  constraint library_catalogs_position_nonnegative check (position >= 0),
  constraint library_catalogs_id_owner_unique unique (id, owner_id),
  constraint library_catalogs_owner_name_unique unique (owner_id, name)
);

create table public.library_catalog_works (
  catalog_id uuid not null,
  work_id uuid not null,
  owner_id uuid not null,
  added_at timestamptz not null default now(),

  primary key (catalog_id, work_id),
  constraint library_catalog_works_catalog_owner_fk
    foreign key (catalog_id, owner_id)
    references public.library_catalogs (id, owner_id)
    on delete cascade,
  constraint library_catalog_works_work_owner_fk
    foreign key (work_id, owner_id)
    references public.works (id, owner_id)
    on delete cascade
);

create index works_library_active_idx
  on public.works (owner_id, archived_at, updated_at desc);

create index works_library_favorites_idx
  on public.works (owner_id, updated_at desc)
  where is_favorite and archived_at is null;

create index library_catalogs_owner_position_idx
  on public.library_catalogs (owner_id, position, created_at);

create index library_catalog_works_owner_work_idx
  on public.library_catalog_works (owner_id, work_id);

alter table public.library_catalogs enable row level security;
alter table public.library_catalog_works enable row level security;

revoke all on table public.library_catalogs from anon, authenticated;
revoke all on table public.library_catalog_works from anon, authenticated;
grant select, insert, update, delete on table public.library_catalogs to authenticated;
grant select, insert, delete on table public.library_catalog_works to authenticated;

create policy "Authors can read their own catalogs"
  on public.library_catalogs for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own catalogs"
  on public.library_catalogs for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can update their own catalogs"
  on public.library_catalogs for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own catalogs"
  on public.library_catalogs for delete to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can read their own catalog works"
  on public.library_catalog_works for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can add their own catalog works"
  on public.library_catalog_works for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can remove their own catalog works"
  on public.library_catalog_works for delete to authenticated
  using ((select auth.uid()) = owner_id);

create trigger library_catalogs_set_updated_at
  before update on public.library_catalogs
  for each row execute procedure private.set_updated_at();

comment on table public.library_catalogs is
  'Coleções editoriais personalizadas criadas pelo autor.';

comment on table public.library_catalog_works is
  'Associação de obras a catálogos; uma obra pode pertencer a várias coleções.';
