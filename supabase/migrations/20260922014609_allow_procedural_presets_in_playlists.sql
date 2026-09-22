alter table public.audio_playlist_items
  alter column track_id drop not null,
  add column preset_id text;

alter table public.audio_playlist_items
  add constraint audio_playlist_items_single_source check (num_nonnulls(track_id, preset_id) = 1),
  add constraint audio_playlist_items_preset_length check (preset_id is null or char_length(preset_id) between 1 and 80);

create unique index audio_playlist_items_playlist_preset_unique
  on public.audio_playlist_items (playlist_id, preset_id)
  where preset_id is not null;
