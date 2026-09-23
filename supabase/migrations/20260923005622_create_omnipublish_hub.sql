create table public.communication_campaigns (
  id uuid primary key default gen_random_uuid(),
  internal_name text not null check (char_length(internal_name) between 2 and 160),
  title text not null check (char_length(title) between 2 and 180),
  summary text not null default '' check (char_length(summary) <= 2000),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'approved', 'scheduled', 'publishing', 'published', 'failed', 'archived')),
  selected_channels text[] not null default '{}'::text[],
  audience_rules jsonb not null default '{"operator":"and","rules":[]}'::jsonb check (jsonb_typeof(audience_rules) = 'object'),
  campaign_tags text[] not null default '{}'::text[],
  scheduled_for timestamptz,
  timezone text not null default 'America/Sao_Paulo',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(selected_channels) > 0),
  check (selected_channels <@ array['email','legal','changelog','knowledge','in_app','status','blog']::text[])
);

create table public.communication_items (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.communication_campaigns (id) on delete cascade,
  channel text not null check (channel in ('email','legal','changelog','knowledge','in_app','status','blog')),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null default '',
  status text not null default 'draft' check (status in ('draft', 'ready', 'queued', 'published', 'failed', 'cancelled')),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  audience_rules jsonb not null default '{"operator":"and","rules":[]}'::jsonb check (jsonb_typeof(audience_rules) = 'object'),
  scheduled_for timestamptz,
  published_at timestamptz,
  delivery_provider text,
  external_reference text,
  last_error text,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, channel)
);

create table public.communication_delivery_attempts (
  id bigint generated always as identity primary key,
  campaign_id uuid not null references public.communication_campaigns (id) on delete cascade,
  item_id uuid not null references public.communication_items (id) on delete cascade,
  attempt_number integer not null default 1 check (attempt_number > 0),
  status text not null check (status in ('queued', 'processing', 'delivered', 'failed', 'cancelled')),
  provider text,
  provider_reference text,
  response_code text,
  response_body jsonb not null default '{}'::jsonb check (jsonb_typeof(response_body) = 'object'),
  error_message text,
  attempted_at timestamptz not null default now()
);

create table public.communication_receipts (
  item_id uuid not null references public.communication_items (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  receipt_type text not null check (receipt_type in ('delivered', 'opened', 'clicked', 'dismissed', 'accepted')),
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  primary key (item_id, user_id, receipt_type)
);

create index communication_campaigns_status_schedule_idx on public.communication_campaigns (status, scheduled_for);
create index communication_campaigns_updated_idx on public.communication_campaigns (updated_at desc);
create index communication_items_channel_status_idx on public.communication_items (channel, status, scheduled_for);
create index communication_items_campaign_idx on public.communication_items (campaign_id);
create index communication_delivery_item_idx on public.communication_delivery_attempts (item_id, attempted_at desc);
create index communication_receipts_user_idx on public.communication_receipts (user_id, occurred_at desc);

alter table public.communication_campaigns enable row level security;
alter table public.communication_items enable row level security;
alter table public.communication_delivery_attempts enable row level security;
alter table public.communication_receipts enable row level security;

revoke all on table public.communication_campaigns, public.communication_items, public.communication_delivery_attempts, public.communication_receipts from anon, authenticated;
grant select, insert on table public.communication_receipts to authenticated;

create policy "Users can read their communication receipts"
  on public.communication_receipts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their communication receipts"
  on public.communication_receipts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create trigger communication_campaigns_set_updated_at before update on public.communication_campaigns
  for each row execute procedure private.set_updated_at();
create trigger communication_items_set_updated_at before update on public.communication_items
  for each row execute procedure private.set_updated_at();

comment on table public.communication_campaigns is 'OmniPublish master campaigns and orchestration state.';
comment on table public.communication_items is 'Channel-specific payloads generated by each OmniPublish campaign.';
comment on table public.communication_delivery_attempts is 'Immutable connector delivery attempts for each publication item.';
comment on table public.communication_receipts is 'Per-user delivery, engagement, dismissal, and legal consent receipts.';

