do $$
begin
  create type public.admin_role as enum (
    'master',
    'engineering',
    'customer_experience',
    'director',
    'finance',
    'product'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.admin_status as enum ('active', 'suspended');
exception
  when duplicate_object then null;
end
$$;

create table public.admin_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  email text not null,
  role public.admin_role not null,
  is_master boolean not null default false,
  status public.admin_status not null default 'active',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint admin_accounts_display_name_length
    check (char_length(btrim(display_name)) between 2 and 120),
  constraint admin_accounts_email_normalized
    check (email = lower(btrim(email)) and email like '%@%'),
  constraint admin_accounts_master_role_consistency
    check ((is_master and role = 'master') or (not is_master and role <> 'master'))
);

comment on table public.admin_accounts is
  'Identidades administrativas. Papéis de autorização nunca são derivados de user_metadata.';

create index admin_accounts_role_status_idx
  on public.admin_accounts (role, status);

create unique index admin_accounts_email_unique_idx
  on public.admin_accounts (lower(email));

create table public.admin_audit_logs (
  id bigint generated always as identity primary key,
  event_id uuid not null default gen_random_uuid() unique,
  actor_id uuid,
  actor_role public.admin_role,
  action text not null,
  target_type text not null,
  target_id text,
  request_id uuid not null default gen_random_uuid(),
  ip_address inet,
  user_agent text,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),

  constraint admin_audit_logs_action_length
    check (char_length(btrim(action)) between 3 and 160),
  constraint admin_audit_logs_target_type_length
    check (char_length(btrim(target_type)) between 2 and 120),
  constraint admin_audit_logs_metadata_object
    check (jsonb_typeof(metadata) = 'object')
);

comment on table public.admin_audit_logs is
  'Trilha administrativa append-only. UPDATE, DELETE e TRUNCATE são proibidos para o cliente de serviço.';

create index admin_audit_logs_actor_time_idx
  on public.admin_audit_logs (actor_id, occurred_at desc);

create index admin_audit_logs_target_time_idx
  on public.admin_audit_logs (target_type, target_id, occurred_at desc);

alter table public.admin_accounts enable row level security;
alter table public.admin_audit_logs enable row level security;

revoke all on table public.admin_accounts from anon, authenticated;
revoke all on table public.admin_audit_logs from anon, authenticated;
revoke update, delete, truncate on table public.admin_audit_logs from service_role;

grant select on table public.admin_accounts to authenticated;
grant select on table public.admin_audit_logs to authenticated;
grant insert, select on table public.admin_audit_logs to service_role;
grant usage, select on sequence public.admin_audit_logs_id_seq to service_role;

create or replace function private.current_admin_role()
returns public.admin_role
language sql
stable
security definer
set search_path = ''
as $$
  select account.role
  from public.admin_accounts as account
  where account.user_id = (select auth.uid())
    and account.status = 'active'
  limit 1
$$;

revoke all on function private.current_admin_role() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.current_admin_role() to authenticated;

create policy "Admins can read their own membership"
  on public.admin_accounts
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select private.current_admin_role()) in ('master', 'engineering', 'director')
  );

create policy "Authorized admins can read audit logs"
  on public.admin_audit_logs
  for select
  to authenticated
  using (
    (select private.current_admin_role()) in ('master', 'engineering', 'director')
  );

create or replace function private.set_admin_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_admin_updated_at() from public, anon, authenticated;

create trigger admin_accounts_set_updated_at
  before update on public.admin_accounts
  for each row execute procedure private.set_admin_updated_at();

create or replace function private.reject_admin_audit_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'admin_audit_logs is append-only';
end;
$$;

revoke all on function private.reject_admin_audit_mutation() from public, anon, authenticated;

create trigger admin_audit_logs_reject_update_delete
  before update or delete on public.admin_audit_logs
  for each row execute procedure private.reject_admin_audit_mutation();

;
