create schema if not exists private;

revoke all on schema private from public;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  pen_name text,
  writing_focus text,
  experience_level text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_display_name_length
    check (char_length(btrim(display_name)) between 2 and 80),
  constraint profiles_pen_name_length
    check (pen_name is null or char_length(btrim(pen_name)) between 2 and 80),
  constraint profiles_writing_focus_values
    check (
      writing_focus is null
      or writing_focus in ('fiction', 'nonfiction', 'poetry', 'screenplay', 'other')
    ),
  constraint profiles_experience_level_values
    check (
      experience_level is null
      or experience_level in ('starting', 'returning', 'published')
    )
);

comment on table public.profiles is
  'Dados públicos do próprio autor. Preferências de autorização nunca devem ser armazenadas aqui.';

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (
  display_name,
  pen_name,
  writing_focus,
  experience_level,
  onboarding_completed_at
) on table public.profiles to authenticated;

create policy "Authors can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Authors can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate_name text;
begin
  candidate_name := left(trim(new.raw_user_meta_data ->> 'display_name'), 80);

  if candidate_name is null or char_length(candidate_name) < 2 then
    candidate_name := left(split_part(coalesce(new.email, ''), '@', 1), 80);
  end if;

  if candidate_name is null or char_length(candidate_name) < 2 then
    candidate_name := 'Autor';
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, candidate_name);

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure private.set_updated_at();
