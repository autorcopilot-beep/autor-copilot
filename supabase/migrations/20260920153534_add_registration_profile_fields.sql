alter table public.profiles
  add column full_name text,
  add column nickname text,
  add column age smallint,
  add column terms_accepted_at timestamptz,
  add column privacy_accepted_at timestamptz,
  add column communications_opt_in boolean not null default false;

alter table public.profiles
  add constraint profiles_full_name_length
    check (full_name is null or char_length(btrim(full_name)) between 3 and 120),
  add constraint profiles_nickname_length
    check (nickname is null or char_length(btrim(nickname)) between 2 and 40),
  add constraint profiles_age_range
    check (age is null or age between 13 and 120);

grant update (full_name, nickname, age, communications_opt_in)
  on table public.profiles to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate_full_name text;
  candidate_nickname text;
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

  insert into public.profiles (
    id, display_name, full_name, nickname, age, terms_accepted_at,
    privacy_accepted_at, communications_opt_in
  )
  values (
    new.id, candidate_nickname, candidate_full_name, candidate_nickname,
    candidate_age,
    case when accepted_terms then now() else null end,
    case when accepted_privacy then now() else null end,
    coalesce((new.raw_user_meta_data ->> 'communications_opt_in')::boolean, false)
  );

  return new;
end;
$$;

;
