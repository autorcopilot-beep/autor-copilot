alter table public.audio_tracks
  add column genre text not null default 'geral',
  add column mood text not null default '',
  add column catalog_slug text not null default 'sound-lab',
  add column energy_level smallint not null default 2 check (energy_level between 1 and 5);

alter table public.audio_user_settings
  add column pomodoro_focus_minutes smallint not null default 25 check (pomodoro_focus_minutes between 5 and 120),
  add column pomodoro_break_minutes smallint not null default 5 check (pomodoro_break_minutes between 1 and 30),
  add column pomodoro_long_break_minutes smallint not null default 15 check (pomodoro_long_break_minutes between 5 and 60),
  add column pomodoro_cycles smallint not null default 4 check (pomodoro_cycles between 1 and 12),
  add column pomodoro_auto_start boolean not null default false,
  add column sound_follows_pomodoro boolean not null default true,
  add column preferred_genres text[] not null default '{}',
  add column show_waveform boolean not null default true;

create table public.audio_playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  genre text not null default 'geral',
  cover_key text not null default 'escrita',
  is_official boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint audio_playlists_title_length check (char_length(btrim(title)) between 1 and 100),
  constraint audio_playlists_description_length check (char_length(description) <= 1000),
  constraint audio_playlists_owner_kind check ((is_official and owner_id is null) or (not is_official and owner_id is not null))
);

create table public.audio_playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.audio_playlists (id) on delete cascade,
  track_id uuid not null references public.audio_tracks (id) on delete cascade,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (playlist_id, track_id)
);

create table public.audio_mix_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  channels jsonb not null default '[]'::jsonb check (jsonb_typeof(channels) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint audio_mix_presets_title_length check (char_length(btrim(title)) between 1 and 80),
  unique (user_id, title)
);

create index audio_tracks_genre_catalog_idx on public.audio_tracks (genre, catalog_slug, is_published, is_featured desc);
create index audio_playlists_owner_idx on public.audio_playlists (owner_id, updated_at desc);
create index audio_playlists_official_idx on public.audio_playlists (is_official, genre, updated_at desc);
create index audio_playlist_items_order_idx on public.audio_playlist_items (playlist_id, position);
create index audio_mix_presets_user_idx on public.audio_mix_presets (user_id, updated_at desc);

alter table public.audio_playlists enable row level security;
alter table public.audio_playlist_items enable row level security;
alter table public.audio_mix_presets enable row level security;

revoke all on table public.audio_playlists, public.audio_playlist_items, public.audio_mix_presets from anon, authenticated;
grant select, insert, update, delete on table public.audio_playlists, public.audio_playlist_items, public.audio_mix_presets to authenticated;

create policy "Installed users can read available playlists"
  on public.audio_playlists for select to authenticated
  using (
    exists (
      select 1 from public.user_extension_installations installation
      where installation.user_id = (select auth.uid())
        and installation.extension_id = 'lab.media-sound'
        and installation.is_active
    )
    and (is_official or owner_id = (select auth.uid()))
  );
create policy "Users can create personal playlists"
  on public.audio_playlists for insert to authenticated
  with check (owner_id = (select auth.uid()) and not is_official);
create policy "Users can update personal playlists"
  on public.audio_playlists for update to authenticated
  using (owner_id = (select auth.uid()) and not is_official)
  with check (owner_id = (select auth.uid()) and not is_official);
create policy "Users can delete personal playlists"
  on public.audio_playlists for delete to authenticated
  using (owner_id = (select auth.uid()) and not is_official);

create policy "Installed users can read visible playlist items"
  on public.audio_playlist_items for select to authenticated
  using (exists (
    select 1 from public.audio_playlists playlist
    where playlist.id = playlist_id
      and (playlist.is_official or playlist.owner_id = (select auth.uid()))
  ));
create policy "Users can add items to personal playlists"
  on public.audio_playlist_items for insert to authenticated
  with check (exists (
    select 1 from public.audio_playlists playlist
    where playlist.id = playlist_id and playlist.owner_id = (select auth.uid()) and not playlist.is_official
  ));
create policy "Users can update items in personal playlists"
  on public.audio_playlist_items for update to authenticated
  using (exists (
    select 1 from public.audio_playlists playlist
    where playlist.id = playlist_id and playlist.owner_id = (select auth.uid()) and not playlist.is_official
  ));
create policy "Users can remove items from personal playlists"
  on public.audio_playlist_items for delete to authenticated
  using (exists (
    select 1 from public.audio_playlists playlist
    where playlist.id = playlist_id and playlist.owner_id = (select auth.uid()) and not playlist.is_official
  ));

create policy "Users can read own mix presets" on public.audio_mix_presets for select to authenticated using (user_id = (select auth.uid()));
create policy "Users can create own mix presets" on public.audio_mix_presets for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users can update own mix presets" on public.audio_mix_presets for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Users can delete own mix presets" on public.audio_mix_presets for delete to authenticated using (user_id = (select auth.uid()));

create trigger audio_playlists_set_updated_at before update on public.audio_playlists for each row execute procedure private.set_updated_at();
create trigger audio_mix_presets_set_updated_at before update on public.audio_mix_presets for each row execute procedure private.set_updated_at();

update public.extension_catalog
set version = '1.2.0', config = coalesce(config, '{}'::jsonb) || '{"playlists":true,"pomodoro":true,"genreCatalogs":true,"savedMixes":true}'::jsonb, updated_at = now()
where id = 'lab.media-sound';
