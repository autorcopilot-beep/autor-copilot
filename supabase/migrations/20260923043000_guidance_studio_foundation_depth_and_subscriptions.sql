alter table public.worldbuilding_profiles
  add column if not exists foundation_depth text not null default 'balanced'
    check (foundation_depth in ('light','balanced','deep'));

alter table public.product_guide_steps
  add column if not exists template_key text not null default 'editorial-card' check (char_length(template_key) <= 100),
  add column if not exists template_html text not null default '' check (char_length(template_html) <= 30000),
  add column if not exists template_css text not null default '' check (char_length(template_css) <= 30000),
  add column if not exists template_js text not null default '' check (char_length(template_js) <= 20000),
  add column if not exists mock_state jsonb not null default '{}'::jsonb check (jsonb_typeof(mock_state) = 'object' and pg_column_size(mock_state) <= 65536);

create table if not exists public.product_guide_templates (
  template_key text primary key check (template_key ~ '^[a-z0-9][a-z0-9._-]{2,99}$'),
  name text not null check (char_length(name) between 2 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  html text not null check (char_length(html) <= 30000),
  css text not null default '' check (char_length(css) <= 30000),
  js text not null default '' check (char_length(js) <= 20000),
  mock_state jsonb not null default '{}'::jsonb check (jsonb_typeof(mock_state) = 'object' and pg_column_size(mock_state) <= 65536),
  is_active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_guide_targets (
  target_key text primary key check (target_key ~ '^[a-z0-9][a-z0-9._-]{2,119}$'),
  route_pattern text not null check (char_length(route_pattern) between 1 and 240),
  selector text not null check (char_length(selector) between 1 and 500),
  label text not null check (char_length(label) between 1 and 160),
  element_kind text not null default 'button' check (element_kind in ('button','link','input','panel','menu','canvas','other')),
  description text not null default '' check (char_length(description) <= 1000),
  source text not null default 'code' check (source in ('code','scanner','mcp','manual')),
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (route_pattern, selector)
);

create table if not exists public.user_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan_code text not null default 'free' check (plan_code in ('free','essential','creator','studio','enterprise')),
  status text not null default 'active' check (status in ('trialing','active','past_due','paused','canceled','legacy')),
  billing_interval text not null default 'none' check (billing_interval in ('none','monthly','annual','lifetime')),
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'BRL' check (currency ~ '^[A-Z]{3}$'),
  starts_at timestamptz not null default now(),
  renews_at timestamptz,
  ends_at timestamptz,
  legacy_price_locked boolean not null default false,
  legacy_price_cents integer check (legacy_price_cents is null or legacy_price_cents >= 0),
  updated_by uuid references auth.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create index if not exists product_guide_templates_updated_by_idx on public.product_guide_templates (updated_by) where updated_by is not null;
create index if not exists product_guide_targets_route_idx on public.product_guide_targets (route_pattern, element_kind);
create index if not exists user_subscriptions_plan_status_idx on public.user_subscriptions (plan_code, status);
create index if not exists user_subscriptions_updated_by_idx on public.user_subscriptions (updated_by) where updated_by is not null;

alter table public.product_guide_templates enable row level security;
alter table public.product_guide_targets enable row level security;
alter table public.user_subscriptions enable row level security;

revoke all on table public.product_guide_templates, public.product_guide_targets, public.user_subscriptions from anon, authenticated;
grant select on table public.product_guide_templates to authenticated;
grant select on table public.user_subscriptions to authenticated;

drop policy if exists "Active guide templates are readable" on public.product_guide_templates;
create policy "Active guide templates are readable" on public.product_guide_templates for select to authenticated using (is_active);
drop policy if exists "Users read their own subscription" on public.user_subscriptions;
create policy "Users read their own subscription" on public.user_subscriptions for select to authenticated using ((select auth.uid()) = user_id);

drop trigger if exists product_guide_templates_set_updated_at on public.product_guide_templates;
create trigger product_guide_templates_set_updated_at before update on public.product_guide_templates for each row execute procedure private.set_updated_at();
drop trigger if exists product_guide_targets_set_updated_at on public.product_guide_targets;
create trigger product_guide_targets_set_updated_at before update on public.product_guide_targets for each row execute procedure private.set_updated_at();
drop trigger if exists user_subscriptions_set_updated_at on public.user_subscriptions;
create trigger user_subscriptions_set_updated_at before update on public.user_subscriptions for each row execute procedure private.set_updated_at();

insert into public.product_guide_templates (template_key, name, description, html, css, js, mock_state)
values
  ('editorial-card', 'Cartão editorial', 'Uma orientação compacta com voz editorial e ação principal.', '<article class="guide"><span class="eyebrow">{{eyebrow}}</span><h2>{{title}}</h2><p>{{message}}</p><button data-guide-action>{{action}}</button></article>', '.guide{font-family:system-ui;padding:22px;border:1px solid #d9ded9;border-radius:20px;background:#fff;color:#24332d;box-shadow:0 18px 50px #183a2c1c}.eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#326b57;font-weight:800}h2{font-family:Georgia,serif;margin:8px 0;font-size:24px}p{color:#65716c;line-height:1.6}button{border:0;border-radius:999px;padding:10px 16px;background:#326b57;color:white;font-weight:700}', 'document.querySelector("[data-guide-action]")?.addEventListener("click",()=>document.body.dataset.previewAction="clicked")', '{"eyebrow":"Guia do produto","title":"Organize sua primeira cena","message":"Use o inspetor para registrar a intenção da cena.","action":"Continuar"}'),
  ('soft-hotspot', 'Hotspot sutil', 'Dica pequena para recursos novos e comandos ocasionais.', '<button class="hotspot" aria-label="{{title}}"><span>✦</span><strong>{{title}}</strong><small>{{message}}</small></button>', '.hotspot{font-family:system-ui;display:grid;grid-template-columns:28px 1fr;gap:2px 10px;align-items:center;text-align:left;border:1px solid #b9d6ca;border-radius:18px;padding:14px;background:#edf7f1;color:#24473a}.hotspot span{grid-row:1/3;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#326b57;color:white}.hotspot strong{font-size:13px}.hotspot small{color:#607169}', '', '{"title":"Novo recurso","message":"Clique para conhecer."}'),
  ('guided-choice', 'Escolha guiada', 'Coach mark com alternativas para jornadas e configuração.', '<section class="choice"><p>{{message}}</p><div><button>Leve</button><button>Média</button><button>Profunda</button></div></section>', '.choice{font-family:system-ui;padding:20px;border-radius:20px;background:#173d31;color:white}.choice p{line-height:1.55}.choice div{display:flex;gap:8px;flex-wrap:wrap}.choice button{border:1px solid #ffffff55;border-radius:999px;padding:9px 13px;background:#ffffff12;color:white}', '', '{"message":"Quanto você quer personalizar esta experiência?"}')
on conflict (template_key) do nothing;

insert into public.product_guide_targets (target_key, route_pattern, selector, label, element_kind, description, source)
values
  ('writing.navigation', '/write/*', '[data-tour="writing-navigation"]', 'Navegação do ambiente', 'button', 'Abre as áreas principais da obra.', 'code'),
  ('writing.tools', '/write/*', '[data-tour="writing-tools"]', 'Ferramentas da obra', 'button', 'Abre relações e ferramentas narrativas.', 'code'),
  ('writing.editor', '/write/editor', '[data-tour="writing-nav-editor"]', 'Editor', 'link', 'Leva ao manuscrito.', 'code'),
  ('writing.encyclopedia', '/write/encyclopedia', '[data-tour="writing-nav-encyclopedia"]', 'Enciclopédia', 'link', 'Leva ao acervo da obra.', 'code'),
  ('encyclopedia.foundation', '/write/encyclopedia', '[data-tour="foundation-journey"]', 'Jornada dos fundamentos', 'panel', 'Personaliza a fundação da obra.', 'code'),
  ('encyclopedia.create', '/write/encyclopedia', '[data-tour="encyclopedia-create"]', 'Criar ficha', 'button', 'Abre o formulário de ficha.', 'code'),
  ('relations.canvas', '/write/relations', '[data-tour="relations-canvas"]', 'Grafo de relações', 'canvas', 'Visualiza vínculos entre universo, obras e fichas.', 'code')
on conflict (target_key) do update set route_pattern = excluded.route_pattern, selector = excluded.selector, label = excluded.label, element_kind = excluded.element_kind, description = excluded.description, source = excluded.source, last_seen_at = now();

insert into public.user_subscriptions (user_id)
select id from auth.users
on conflict (user_id) do nothing;
