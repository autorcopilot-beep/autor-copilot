+alter table public.profiles
  add column bio text,
  add column writing_genres text[] not null default '{}'::text[],
  add column locale text not null default 'pt-BR',
  add column country_code text,
  add column timezone text not null default 'America/Sao_Paulo',
  add column avatar_url text;

alter table public.profiles
  add constraint profiles_bio_length
    check (bio is null or char_length(bio) <= 500),
  add constraint profiles_writing_genres_limit
    check (cardinality(writing_genres) <= 8),
  add constraint profiles_locale_length
    check (char_length(locale) between 2 and 16),
  add constraint profiles_country_code_format
    check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  add constraint profiles_timezone_length
    check (char_length(timezone) between 3 and 64),
  add constraint profiles_avatar_url_length
    check (avatar_url is null or char_length(avatar_url) <= 2048);

grant update (
  bio,
  writing_genres,
  locale,
  country_code,
  timezone,
  avatar_url
) on table public.profiles to authenticated;
