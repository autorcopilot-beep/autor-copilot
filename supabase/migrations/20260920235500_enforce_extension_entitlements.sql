create table public.user_extension_entitlements (
  user_id uuid not null references auth.users (id) on delete cascade,
  extension_id text not null references public.extension_catalog (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'pending', 'expired', 'revoked')),
  source text not null check (source in ('purchase', 'subscription', 'plan', 'admin', 'promotion')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  granted_by uuid references auth.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, extension_id),
  check (ends_at is null or ends_at > starts_at)
);

create index user_extension_entitlements_active_idx
  on public.user_extension_entitlements (user_id, status, ends_at);

alter table public.user_extension_entitlements enable row level security;
revoke all on table public.user_extension_entitlements from anon, authenticated;
grant select on table public.user_extension_entitlements to authenticated;

create policy "Users can read their extension entitlements"
  on public.user_extension_entitlements
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger user_extension_entitlements_set_updated_at
  before update on public.user_extension_entitlements
  for each row execute procedure private.set_updated_at();

create or replace function private.can_activate_extension(target_user_id uuid, target_extension_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.extension_catalog as extension
    where extension.id = target_extension_id
      and extension.is_published
      and coalesce(
        (select access.status = 'active'
         from public.user_access_profiles as access
         where access.user_id = target_user_id),
        true
      )
      and extension.allowed_groups && coalesce(
        (select access.groups
         from public.user_access_profiles as access
         where access.user_id = target_user_id),
        array['free']::text[]
      )
      and (
        extension.feature_flag is null
        or exists (
          select 1
          from public.feature_flags as flag
          where flag.key = extension.feature_flag
            and flag.enabled
            and flag.allowed_groups && coalesce(
              (select access.groups
               from public.user_access_profiles as access
               where access.user_id = target_user_id),
              array['free']::text[]
            )
            and mod(hashtextextended(target_user_id::text || ':' || flag.key, 0) & 9223372036854775807, 100) < flag.rollout_percentage
        )
      )
      and (
        extension.price_model = 'free'
        or (extension.price_model = 'pro_included' and 'pro' = any(coalesce(
          (select access.groups
           from public.user_access_profiles as access
           where access.user_id = target_user_id),
          array['free']::text[]
        )))
        or exists (
          select 1
          from public.user_extension_entitlements as entitlement
          where entitlement.user_id = target_user_id
            and entitlement.extension_id = target_extension_id
            and entitlement.status = 'active'
            and entitlement.starts_at <= now()
            and (entitlement.ends_at is null or entitlement.ends_at > now())
        )
      )
  );
$$;

revoke all on function private.can_activate_extension(uuid, text) from public;
grant execute on function private.can_activate_extension(uuid, text) to authenticated;

drop policy if exists "Users can install allowed extensions" on public.user_extension_installations;
drop policy if exists "Users can update their extension installations" on public.user_extension_installations;

create policy "Users can install acquired extensions"
  on public.user_extension_installations
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      not is_active
      or private.can_activate_extension((select auth.uid()), extension_id)
    )
  );

create policy "Users can update acquired extensions"
  on public.user_extension_installations
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (
      not is_active
      or private.can_activate_extension((select auth.uid()), extension_id)
    )
  );

comment on table public.user_extension_entitlements is
  'Server-managed purchases, subscriptions, plan grants and promotional access for extensions.';
comment on function private.can_activate_extension(uuid, text) is
  'Authoritative RLS check for publication, account, group, rollout and acquisition before activation.';
