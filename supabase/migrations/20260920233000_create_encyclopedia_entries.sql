create type public.encyclopedia_entry_type as enum (
  'character',
  'location',
  'organization',
  'object',
  'concept',
  'event'
);

create table public.encyclopedia_entries (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null,
  owner_id uuid not null,
  entry_type public.encyclopedia_entry_type not null default 'character',
  name text not null,
  aliases text[] not null default '{}',
  summary text not null default '',
  details text not null default '',
  color text not null default 'violet',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint encyclopedia_entries_name_length
    check (char_length(btrim(name)) between 1 and 120),
  constraint encyclopedia_entries_aliases_count
    check (cardinality(aliases) <= 20),
  constraint encyclopedia_entries_summary_length
    check (char_length(summary) <= 1000),
  constraint encyclopedia_entries_details_length
    check (char_length(details) <= 30000),
  constraint encyclopedia_entries_color_value
    check (color in ('violet', 'blue', 'green', 'amber', 'rose', 'slate')),
  constraint encyclopedia_entries_work_owner_fk
    foreign key (work_id, owner_id)
    references public.works (id, owner_id)
    on delete cascade,
  constraint encyclopedia_entries_id_owner_unique
    unique (id, owner_id)
);

create index encyclopedia_entries_work_type_name_idx
  on public.encyclopedia_entries (work_id, entry_type, name);

create index encyclopedia_entries_owner_updated_idx
  on public.encyclopedia_entries (owner_id, updated_at desc);

alter table public.encyclopedia_entries enable row level security;

revoke all on table public.encyclopedia_entries from anon, authenticated;
grant select, insert, update, delete on table public.encyclopedia_entries to authenticated;

create policy "Authors can read their own encyclopedia entries"
  on public.encyclopedia_entries for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own encyclopedia entries"
  on public.encyclopedia_entries for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can update their own encyclopedia entries"
  on public.encyclopedia_entries for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own encyclopedia entries"
  on public.encyclopedia_entries for delete to authenticated
  using ((select auth.uid()) = owner_id);

create trigger encyclopedia_entries_set_updated_at
  before update on public.encyclopedia_entries
  for each row execute procedure private.set_updated_at();

comment on table public.encyclopedia_entries is
  'Entidades de mundo pertencentes a uma obra e referenciáveis no editor por menções com @.';
