create type public.audio_track_kind as enum ('ambient', 'longform', 'audiobook', 'mixer_layer');

create table public.audio_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  author_name text not null default 'Autor Copilot Sound Lab',
  track_kind public.audio_track_kind not null default 'ambient',
  description text not null default '',
  audio_path text not null default '',
  cover_path text not null default '',
  duration_seconds integer not null default 0 check (duration_seconds between 0 and 86400),
  sampling_rate_hz integer not null default 48000 check (sampling_rate_hz in (44100, 48000, 96000)),
  format_encoding text not null default 'opus' check (format_encoding in ('opus', 'flac_24bit', 'aac', 'mp3', 'wav')),
  spatial_mode text not null default 'stereo' check (spatial_mode in ('stereo', 'binaural_hrtf', 'surround_simulated')),
  mental_rhythm_bpm integer not null default 50 check (mental_rhythm_bpm between 20 and 180),
  tags text[] not null default '{}',
  waveform_peaks smallint[] not null default '{}',
  transcript jsonb not null default '[]'::jsonb check (jsonb_typeof(transcript) = 'array'),
  license_name text not null default 'Todos os direitos reservados',
  license_url text not null default '',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  listen_count bigint not null default 0 check (listen_count >= 0),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint audio_tracks_title_length check (char_length(btrim(title)) between 1 and 160),
  constraint audio_tracks_description_length check (char_length(description) <= 5000),
  constraint audio_tracks_paths check (char_length(audio_path) <= 500 and char_length(cover_path) <= 500)
);

create table public.audio_user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  master_volume integer not null default 65 check (master_volume between 0 and 100),
  spatial_mode text not null default 'stereo' check (spatial_mode in ('stereo', 'binaural_hrtf', 'surround_simulated')),
  playback_rate numeric(3,2) not null default 1 check (playback_rate in (0.8, 1, 1.2, 1.5, 2)),
  auto_pause_on_typing_stop boolean not null default false,
  typing_inactivity_threshold_ms integer not null default 2000 check (typing_inactivity_threshold_ms between 500 and 10000),
  crossfade_duration_ms integer not null default 1200 check (crossfade_duration_ms between 0 and 5000),
  mixer_channels jsonb not null default '[{"id":"pink_noise","label":"Ruído rosa","volumePercent":35,"syncWithTypingWpm":false,"active":false},{"id":"rain_glass","label":"Chuva na janela","volumePercent":60,"syncWithTypingWpm":true,"active":false},{"id":"typewriter_keys","label":"Teclas mecânicas","volumePercent":20,"syncWithTypingWpm":true,"active":false}]'::jsonb check (jsonb_typeof(mixer_channels) = 'array'),
  favorite_track_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.audio_editorial_markers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  track_id uuid not null references public.audio_tracks (id) on delete cascade,
  time_ms integer not null check (time_ms >= 0),
  marker_type text not null default 'note' check (marker_type in ('note', 'cut', 'pause', 'pronunciation', 'prosody')),
  note text not null default '' check (char_length(note) <= 2000),
  created_at timestamptz not null default now()
);

create index audio_tracks_discovery_idx on public.audio_tracks (is_published, track_kind, is_featured desc, updated_at desc);
create index audio_editorial_markers_user_track_idx on public.audio_editorial_markers (user_id, track_id, time_ms);

alter table public.audio_tracks enable row level security;
alter table public.audio_user_settings enable row level security;
alter table public.audio_editorial_markers enable row level security;

revoke all on table public.audio_tracks, public.audio_user_settings, public.audio_editorial_markers from anon, authenticated;
grant select on table public.audio_tracks to authenticated;
grant select, insert, update on table public.audio_user_settings to authenticated;
grant select, insert, update, delete on table public.audio_editorial_markers to authenticated;

create policy "Installed users can discover published audio"
  on public.audio_tracks for select to authenticated
  using (
    is_published and exists (
      select 1 from public.user_extension_installations installation
      where installation.user_id = (select auth.uid())
        and installation.extension_id = 'lab.media-sound'
        and installation.is_active
    )
  );
create policy "Users can read audio settings" on public.audio_user_settings for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create audio settings" on public.audio_user_settings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update audio settings" on public.audio_user_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can read audio markers" on public.audio_editorial_markers for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create audio markers" on public.audio_editorial_markers for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update audio markers" on public.audio_editorial_markers for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete audio markers" on public.audio_editorial_markers for delete to authenticated using ((select auth.uid()) = user_id);

create trigger audio_tracks_set_updated_at before update on public.audio_tracks for each row execute procedure private.set_updated_at();
create trigger audio_user_settings_set_updated_at before update on public.audio_user_settings for each row execute procedure private.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('sound-library', 'sound-library', false, 262144000, array['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/flac']),
  ('sound-covers', 'sound-covers', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Installed users can hear sound library" on storage.objects for select to authenticated
using (bucket_id in ('sound-library', 'sound-covers') and exists (
  select 1 from public.user_extension_installations installation
  where installation.user_id = (select auth.uid()) and installation.extension_id = 'lab.media-sound' and installation.is_active
));

insert into public.extension_catalog (id, name, version, product_kind, category, description, author, price_model, price_cents, currency, allowed_groups, tags, feature_flag, is_published, is_featured, config)
values ('lab.media-sound', 'Autor Copilot Media & Sound', '1.0.0', 'extension', 'narrative', 'Biblioteca sonora, player persistente e mixer de paisagens acústicas para escrever e revisar.', 'Autor Copilot Sound Lab', 'free', 0, 'BRL', array['free','pro','beta'], array['Áudio','Foco','Paisagens sonoras','Audiolivro'], 'extensions.media_sound', true, true, '{"performanceBudgetMs":5,"runsLocallyOnly":false,"route":"/sound"}'::jsonb)
on conflict (id) do update set name = excluded.name, description = excluded.description, tags = excluded.tags, feature_flag = excluded.feature_flag, is_published = true;

insert into public.feature_flags (key, name, description, enabled, rollout_percentage, allowed_groups, tags)
values ('extensions.media_sound', 'Autor Copilot Media & Sound', 'Libera biblioteca sonora, player global e mixer do editor.', true, 100, array['free','pro','beta'], array['extensions','audio','focus'])
on conflict (key) do update set name = excluded.name, description = excluded.description;
