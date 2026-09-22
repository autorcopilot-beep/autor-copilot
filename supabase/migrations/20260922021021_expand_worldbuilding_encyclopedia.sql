alter table public.encyclopedia_entries
  add column template_id text not null default '';

alter table public.encyclopedia_entries
  drop constraint encyclopedia_entries_profile_answers_shape,
  add constraint encyclopedia_entries_profile_answers_shape
    check (jsonb_typeof(profile_answers) = 'object' and pg_column_size(profile_answers) <= 65536),
  add constraint encyclopedia_entries_template_id_length
    check (char_length(template_id) <= 80);

comment on column public.encyclopedia_entries.template_id is
  'Modelo especializado da ficha, como assentamento, dinastia, guerra, artefato ou sistema mágico.';

create table public.worldbuilding_profiles (
  work_id uuid not null,
  owner_id uuid not null,
  methodology text not null default 'inside_out'
    check (methodology in ('top_down', 'bottom_up', 'inside_out')),
  mice_focus text not null default 'character'
    check (mice_focus in ('milieu', 'idea', 'character', 'event')),
  genres text[] not null default '{}',
  pov_mode text not null default 'third_limited'
    check (pov_mode in ('first', 'third_limited', 'third_omniscient', 'multiple')),
  psychic_distance smallint not null default 3
    check (psychic_distance between 1 and 5),
  incluing_enabled boolean not null default true,
  genre_answers jsonb not null default '{}'::jsonb,
  lore_answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (work_id, owner_id),
  constraint worldbuilding_profiles_work_owner_fk
    foreign key (work_id, owner_id)
    references public.works (id, owner_id)
    on delete cascade,
  constraint worldbuilding_profiles_genres_count
    check (cardinality(genres) <= 8),
  constraint worldbuilding_profiles_answers_shape
    check (
      jsonb_typeof(genre_answers) = 'object'
      and jsonb_typeof(lore_answers) = 'object'
      and pg_column_size(genre_answers) <= 65536
      and pg_column_size(lore_answers) <= 65536
    )
);

create index worldbuilding_profiles_owner_updated_idx
  on public.worldbuilding_profiles (owner_id, updated_at desc);

alter table public.worldbuilding_profiles enable row level security;

revoke all on table public.worldbuilding_profiles from anon, authenticated;
grant select, insert, update, delete on table public.worldbuilding_profiles to authenticated;

create policy "Authors can read their own worldbuilding profile"
  on public.worldbuilding_profiles for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own worldbuilding profile"
  on public.worldbuilding_profiles for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can update their own worldbuilding profile"
  on public.worldbuilding_profiles for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own worldbuilding profile"
  on public.worldbuilding_profiles for delete to authenticated
  using ((select auth.uid()) = owner_id);

create trigger worldbuilding_profiles_set_updated_at
  before update on public.worldbuilding_profiles
  for each row execute procedure private.set_updated_at();

comment on table public.worldbuilding_profiles is
  'Direção estrutural da obra: método de construção, MICE, gêneros, ponto de vista e arquitetura da lore.';
