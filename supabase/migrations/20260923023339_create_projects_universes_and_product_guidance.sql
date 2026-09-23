create table public.creative_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 4000),
  status text not null default 'active' check (status in ('active','paused','archived')),
  color text not null default 'sage' check (char_length(color) <= 32),
  cover_url text not null default '' check (char_length(cover_url) <= 2000),
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table public.story_universes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null,
  name text not null check (char_length(btrim(name)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 8000),
  canon_policy text not null default 'shared' check (canon_policy in ('shared','branching','independent')),
  era_label text not null default '' check (char_length(era_label) <= 120),
  color text not null default 'sage' check (char_length(color) <= 32),
  cover_url text not null default '' check (char_length(cover_url) <= 2000),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (project_id, owner_id) references public.creative_projects (id, owner_id) on delete cascade
);

create table public.universe_works (
  universe_id uuid not null,
  work_id uuid not null,
  owner_id uuid not null,
  continuity_role text not null default 'primary' check (continuity_role in ('primary','prequel','sequel','spin_off','alternate','reference')),
  chronology_order numeric(10,2) not null default 0,
  notes text not null default '' check (char_length(notes) <= 4000),
  created_at timestamptz not null default now(),
  primary key (universe_id, work_id),
  foreign key (universe_id, owner_id) references public.story_universes (id, owner_id) on delete cascade,
  foreign key (work_id, owner_id) references public.works (id, owner_id) on delete cascade
);

create table public.universe_graph_edges (
  id uuid primary key default gen_random_uuid(),
  universe_id uuid not null,
  owner_id uuid not null,
  source_kind text not null check (source_kind in ('universe','work','entry')),
  source_id uuid not null,
  target_kind text not null check (target_kind in ('universe','work','entry')),
  target_id uuid not null,
  relation_type text not null check (char_length(btrim(relation_type)) between 1 and 80),
  label text not null default '' check (char_length(label) <= 160),
  direction text not null default 'directed' check (direction in ('directed','bidirectional')),
  weight smallint not null default 1 check (weight between 1 and 10),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (universe_id, owner_id) references public.story_universes (id, owner_id) on delete cascade,
  check (source_kind <> target_kind or source_id <> target_id),
  unique (universe_id, source_kind, source_id, target_kind, target_id, relation_type)
);

alter table public.worldbuilding_profiles
  add column foundation_step integer not null default 0 check (foundation_step between 0 and 200),
  add column foundation_preset text not null default '' check (char_length(foundation_preset) <= 80),
  add column foundation_completed_at timestamptz,
  add column foundation_assets jsonb not null default '[]'::jsonb check (jsonb_typeof(foundation_assets) = 'array' and pg_column_size(foundation_assets) <= 65536);

create table public.product_guides (
  id uuid primary key default gen_random_uuid(),
  guide_key text not null unique check (guide_key ~ '^[a-z0-9][a-z0-9._-]{2,99}$'),
  name text not null check (char_length(name) between 2 and 140),
  description text not null default '' check (char_length(description) <= 1000),
  experience_type text not null check (experience_type in ('tour','coach_mark','walkthrough','tooltip_tour','hotspot')),
  route_pattern text not null check (char_length(route_pattern) between 1 and 240),
  feature_key text not null default '' check (char_length(feature_key) <= 100),
  enabled boolean not null default false,
  new_users_only boolean not null default true,
  rollout_percentage integer not null default 100 check (rollout_percentage between 0 and 100),
  allowed_groups text[] not null default '{}',
  allowed_tags text[] not null default '{}',
  priority integer not null default 100 check (priority between 0 and 10000),
  version integer not null default 1 check (version > 0),
  starts_at timestamptz,
  ends_at timestamptz,
  dismissible boolean not null default true,
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.product_guide_steps (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.product_guides (id) on delete cascade,
  position integer not null check (position >= 0),
  selector text not null default '' check (char_length(selector) <= 500),
  title text not null check (char_length(title) between 1 and 160),
  message text not null check (char_length(message) between 1 and 2000),
  placement text not null default 'bottom' check (placement in ('top','right','bottom','left','center')),
  animation text not null default 'fade' check (animation in ('fade','slide','pulse','spotlight','none')),
  action_label text not null default '' check (char_length(action_label) <= 60),
  action_href text not null default '' check (char_length(action_href) <= 500),
  media_url text not null default '' check (char_length(media_url) <= 2000),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guide_id, position)
);

create table public.user_guide_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  guide_id uuid not null references public.product_guides (id) on delete cascade,
  guide_version integer not null check (guide_version > 0),
  status text not null default 'started' check (status in ('started','completed','dismissed')),
  current_step integer not null default 0 check (current_step >= 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  dismissed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, guide_id)
);

create index creative_projects_owner_status_idx on public.creative_projects (owner_id, status, updated_at desc);
create index story_universes_project_idx on public.story_universes (project_id, updated_at desc);
create index story_universes_owner_idx on public.story_universes (owner_id, updated_at desc);
create index universe_works_owner_work_idx on public.universe_works (owner_id, work_id);
create index universe_works_chronology_idx on public.universe_works (universe_id, chronology_order);
create index universe_graph_edges_source_idx on public.universe_graph_edges (universe_id, source_kind, source_id);
create index universe_graph_edges_target_idx on public.universe_graph_edges (universe_id, target_kind, target_id);
create index product_guides_delivery_idx on public.product_guides (enabled, priority, starts_at, ends_at);
create index product_guide_steps_guide_idx on public.product_guide_steps (guide_id, position);
create index user_guide_progress_user_status_idx on public.user_guide_progress (user_id, status, updated_at desc);
create index product_guides_created_by_idx on public.product_guides (created_by) where created_by is not null;
create index product_guides_updated_by_idx on public.product_guides (updated_by) where updated_by is not null;

alter table public.creative_projects enable row level security;
alter table public.story_universes enable row level security;
alter table public.universe_works enable row level security;
alter table public.universe_graph_edges enable row level security;
alter table public.product_guides enable row level security;
alter table public.product_guide_steps enable row level security;
alter table public.user_guide_progress enable row level security;

revoke all on table public.creative_projects, public.story_universes, public.universe_works, public.universe_graph_edges, public.product_guides, public.product_guide_steps, public.user_guide_progress from anon, authenticated;
grant select, insert, update, delete on table public.creative_projects, public.story_universes, public.universe_works, public.universe_graph_edges, public.user_guide_progress to authenticated;
grant select on table public.product_guides, public.product_guide_steps to authenticated;

create policy "Authors manage their own creative projects" on public.creative_projects for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Authors manage their own universes" on public.story_universes for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Authors manage their own universe works" on public.universe_works for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Authors manage their own universe graph" on public.universe_graph_edges for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Active product guides are readable" on public.product_guides for select to authenticated using (enabled and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));
create policy "Active product guide steps are readable" on public.product_guide_steps for select to authenticated using (exists (select 1 from public.product_guides guide where guide.id = guide_id and guide.enabled and (guide.starts_at is null or guide.starts_at <= now()) and (guide.ends_at is null or guide.ends_at > now())));
create policy "Users manage their own guide progress" on public.user_guide_progress for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create trigger creative_projects_set_updated_at before update on public.creative_projects for each row execute procedure private.set_updated_at();
create trigger story_universes_set_updated_at before update on public.story_universes for each row execute procedure private.set_updated_at();
create trigger universe_graph_edges_set_updated_at before update on public.universe_graph_edges for each row execute procedure private.set_updated_at();
create trigger product_guides_set_updated_at before update on public.product_guides for each row execute procedure private.set_updated_at();
create trigger product_guide_steps_set_updated_at before update on public.product_guide_steps for each row execute procedure private.set_updated_at();
create trigger user_guide_progress_set_updated_at before update on public.user_guide_progress for each row execute procedure private.set_updated_at();

insert into public.product_guides (guide_key, name, description, experience_type, route_pattern, enabled, new_users_only, priority, version, settings)
values
  ('workspace.first-steps', 'Primeiros passos no ambiente de escrita', 'Apresenta a navegação principal sem interromper a escrita.', 'tour', '/write/*', true, true, 20, 1, '{"maxAgeDays":30}'),
  ('encyclopedia.foundation-journey', 'Jornada dos fundamentos', 'Convida o autor a construir os fundamentos uma pergunta por vez.', 'walkthrough', '/write/encyclopedia', true, true, 10, 1, '{"maxAgeDays":60}'),
  ('encyclopedia.create-entry', 'Primeira ficha da Enciclopédia', 'Mostra onde registrar o primeiro elemento do universo.', 'coach_mark', '/write/encyclopedia', true, true, 30, 1, '{"maxAgeDays":60}'),
  ('editor.mention-extension', 'Menções com @', 'Apresenta a contextualização de personagens e elementos no manuscrito.', 'hotspot', '/write/editor', true, true, 40, 1, '{"maxAgeDays":60}'),
  ('sound.focus-mixer', 'Som para entrar no ritmo', 'Revela o mixer e os presets de foco quando forem úteis.', 'hotspot', '/write/*', true, false, 80, 1, '{"maxAgeDays":365}')
on conflict (guide_key) do nothing;

insert into public.product_guide_steps (guide_id, position, selector, title, message, placement, animation, action_label, action_href)
select guide.id, seed.position, seed.selector, seed.title, seed.message, seed.placement, seed.animation, seed.action_label, seed.action_href
from public.product_guides guide
join (values
  ('workspace.first-steps', 0, '[data-tour="writing-nav-editor"]', 'Seu manuscrito começa aqui', 'Abra o Editor para escrever e organizar capítulos sem sair do ambiente.', 'right', 'spotlight', '', ''),
  ('workspace.first-steps', 1, '[data-tour="writing-nav-encyclopedia"]', 'A memória da história', 'A Enciclopédia guarda personagens, lugares, regras e relações que podem ser citados com @.', 'right', 'spotlight', 'Abrir Enciclopédia', '/write/encyclopedia'),
  ('encyclopedia.foundation-journey', 0, '[data-tour="encyclopedia-foundation"]', 'Construa a base em pequenas decisões', 'Fundamentos agora é uma jornada: uma pergunta, contexto e exemplo por vez. Você pode sair e continuar depois.', 'bottom', 'slide', 'Começar jornada', ''),
  ('encyclopedia.create-entry', 0, '[data-tour="encyclopedia-create"]', 'Registre o primeiro elemento', 'Crie uma ficha e conecte personagens, lugares, organizações, objetos, conceitos e eventos ao seu universo.', 'left', 'fade', 'Criar ficha', ''),
  ('editor.mention-extension', 0, '[data-tour="editor-canvas"]', 'Contexto sem sair do texto', 'Digite @ no manuscrito para vincular uma ficha da Enciclopédia e verificar referências.', 'top', 'pulse', '', ''),
  ('sound.focus-mixer', 0, '[data-tour="sound-menu"]', 'Uma paisagem sonora para esta sessão', 'Abra o Sound para combinar ambientes, playlists e pomodoro sem abandonar a obra.', 'bottom', 'pulse', '', '')
) as seed(guide_key, position, selector, title, message, placement, animation, action_label, action_href)
  on guide.guide_key = seed.guide_key
on conflict (guide_id, position) do nothing;

comment on table public.creative_projects is 'Editorial projects grouping one or more story universes.';
comment on table public.story_universes is 'Canon and continuity boundaries shared by one or more works.';
comment on table public.universe_graph_edges is 'Directed or bidirectional semantic relations between universes, works and encyclopedia entries.';
comment on table public.product_guides is 'Admin-orchestrated tours, walkthroughs, coach marks, tooltip tours and hotspots.';
