alter table public.profiles
  rename column avatar_url to avatar_path;

alter table public.profiles
  add column username text;

update public.profiles
set username = 'usuario_' || left(replace(id::text, '-', ''), 10)
where username is null;

alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_format
    check (username ~ '^[a-z0-9_]{3,24}$');

create unique index profiles_username_unique
  on public.profiles (username);

grant update (username, avatar_path)
  on table public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-avatars',
  'profile-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload their own profile avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'profile-avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
    and storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp')
  );

create policy "Users can read their own profile avatar"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'profile-avatars'
    and owner_id = (select auth.uid()::text)
  );

create policy "Users can delete their own profile avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'profile-avatars'
    and owner_id = (select auth.uid()::text)
  );

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate_full_name text;
  candidate_nickname text;
  candidate_username text;
  candidate_age smallint;
  accepted_terms boolean;
  accepted_privacy boolean;
begin
  candidate_full_name := left(trim(new.raw_user_meta_data ->> 'full_name'), 120);
  candidate_nickname := left(trim(new.raw_user_meta_data ->> 'nickname'), 40);
  candidate_age := nullif(new.raw_user_meta_data ->> 'age', '')::smallint;
  accepted_terms := coalesce((new.raw_user_meta_data ->> 'terms_accepted')::boolean, false);
  accepted_privacy := coalesce((new.raw_user_meta_data ->> 'privacy_accepted')::boolean, false);

  if candidate_full_name is null or char_length(candidate_full_name) < 3 then
    candidate_full_name := left(split_part(coalesce(new.email, ''), '@', 1), 120);
  end if;

  if candidate_full_name is null or char_length(candidate_full_name) < 2 then
    candidate_full_name := 'Autor';
  end if;

  if candidate_nickname is null or char_length(candidate_nickname) < 2 then
    candidate_nickname := left(candidate_full_name, 40);
  end if;

  candidate_username := 'usuario_' || left(replace(new.id::text, '-', ''), 10);

  insert into public.profiles (
    id, display_name, full_name, nickname, username, age, terms_accepted_at,
    privacy_accepted_at, communications_opt_in
  )
  values (
    new.id, candidate_nickname, candidate_full_name, candidate_nickname,
    candidate_username, candidate_age,
    case when accepted_terms then now() else null end,
    case when accepted_privacy then now() else null end,
    coalesce((new.raw_user_meta_data ->> 'communications_opt_in')::boolean, false)
  );

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
