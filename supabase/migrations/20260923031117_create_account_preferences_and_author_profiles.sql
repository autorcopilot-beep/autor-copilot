create extension if not exists vector with schema extensions;

create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  writing jsonb not null default '{"dailyGoal":1000,"autosave":true,"spellcheck":true,"openLastWork":true,"focusMode":false,"pagePreset":"book"}'::jsonb check (jsonb_typeof(writing) = 'object'),
  appearance jsonb not null default '{"theme":"system","fontSize":19,"lineHeight":1.65,"textWidth":68,"reduceMotion":false,"highContrast":false}'::jsonb check (jsonb_typeof(appearance) = 'object'),
  notifications jsonb not null default '{"inApp":true,"emailMentions":true,"emailReminders":true,"goalReminders":false,"collaboration":true,"security":true}'::jsonb check (jsonb_typeof(notifications) = 'object'),
  communications jsonb not null default '{"productUpdates":true,"editorialDigest":false,"researchInvites":false,"changelog":true}'::jsonb check (jsonb_typeof(communications) = 'object'),
  privacy jsonb not null default '{"usageMetadata":true,"personalizedRecommendations":true,"publicProfile":false,"compatibilityDiscovery":false,"proseAnalysisConsent":false}'::jsonb check (jsonb_typeof(privacy) = 'object'),
  ai jsonb not null default '{"enabled":true,"useEncyclopedia":true,"useCurrentChapter":true,"useOtherWorks":false,"rememberInstructions":true}'::jsonb check (jsonb_typeof(ai) = 'object'),
  guidance jsonb not null default '{"enabled":true,"hotspots":true,"announcements":true}'::jsonb check (jsonb_typeof(guidance) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (pg_column_size(writing) + pg_column_size(appearance) + pg_column_size(notifications) + pg_column_size(communications) + pg_column_size(privacy) + pg_column_size(ai) + pg_column_size(guidance) <= 65536)
);

create table public.author_archetypes (
  id uuid primary key default gen_random_uuid(),
  code_prefix text not null unique check (code_prefix ~ '^[A-Z]{3,8}$'),
  name text not null check (char_length(name) between 2 and 80),
  tagline text not null default '' check (char_length(tagline) <= 180),
  description text not null default '' check (char_length(description) <= 2000),
  advancement_text text not null default '' check (char_length(advancement_text) <= 1000),
  benefits jsonb not null default '[]'::jsonb check (jsonb_typeof(benefits) = 'array'),
  accent_color text not null default '#2F6B57' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  image_url text not null default '' check (char_length(image_url) <= 2000),
  asset_key text not null default '' check (char_length(asset_key) <= 120),
  stage_min smallint not null default 0 check (stage_min between 0 and 100),
  stage_max smallint not null default 100 check (stage_max between 0 and 100 and stage_max >= stage_min),
  sort_order smallint not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_author_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  archetype_id uuid not null references public.author_archetypes (id),
  public_code text not null default 'NOV-C05-TRI' check (public_code ~ '^[A-Z]{3,8}-[A-Z][0-9]{2}-[A-Z]{3,5}$'),
  stage_score smallint not null default 5 check (stage_score between 0 and 100),
  rhythm_code text not null default 'C' check (rhythm_code ~ '^[A-Z]$'),
  plan_code text not null default 'TRI' check (plan_code ~ '^[A-Z]{3,5}$'),
  stable_since timestamptz not null default now(),
  pending_archetype_id uuid references public.author_archetypes (id),
  pending_recomputations smallint not null default 0 check (pending_recomputations between 0 and 2),
  last_explanation text not null default 'Perfil inicial baseado somente nas preferências informadas no onboarding.' check (char_length(last_explanation) <= 1000),
  computed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_behavior_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  usage_vector extensions.vector(24),
  normalized_signals jsonb not null default '{}'::jsonb check (jsonb_typeof(normalized_signals) = 'object'),
  segment_key text not null default 'TRI' check (char_length(segment_key) <= 40),
  history_distance numeric(8,5),
  churn_signal text not null default 'unknown' check (churn_signal in ('unknown','stable','watch','risk')),
  rolling_window_weeks smallint not null default 8 check (rolling_window_weeks between 4 and 52),
  content_derived boolean not null default false,
  consent_snapshot_at timestamptz,
  computed_at timestamptz,
  updated_at timestamptz not null default now(),
  check (not content_derived or consent_snapshot_at is not null)
);

create index author_archetypes_active_order_idx on public.author_archetypes (is_active, sort_order);
create index user_author_profiles_archetype_idx on public.user_author_profiles (archetype_id);
create index user_author_profiles_pending_idx on public.user_author_profiles (pending_archetype_id) where pending_archetype_id is not null;
create index user_behavior_profiles_churn_idx on public.user_behavior_profiles (churn_signal, computed_at desc);

alter table public.user_preferences enable row level security;
alter table public.author_archetypes enable row level security;
alter table public.user_author_profiles enable row level security;
alter table public.user_behavior_profiles enable row level security;

revoke all on table public.user_preferences, public.author_archetypes, public.user_author_profiles, public.user_behavior_profiles from anon, authenticated;
grant select, insert, update on table public.user_preferences to authenticated;
grant select on table public.author_archetypes, public.user_author_profiles to authenticated;

create policy "Users manage their own preferences" on public.user_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Active archetypes are readable" on public.author_archetypes for select to authenticated using (is_active);
create policy "Users read their own author profile" on public.user_author_profiles for select to authenticated using ((select auth.uid()) = user_id);

create trigger user_preferences_set_updated_at before update on public.user_preferences for each row execute procedure private.set_updated_at();
create trigger author_archetypes_set_updated_at before update on public.author_archetypes for each row execute procedure private.set_updated_at();
create trigger user_author_profiles_set_updated_at before update on public.user_author_profiles for each row execute procedure private.set_updated_at();
create trigger user_behavior_profiles_set_updated_at before update on public.user_behavior_profiles for each row execute procedure private.set_updated_at();

insert into public.author_archetypes (code_prefix, name, tagline, description, advancement_text, benefits, accent_color, asset_key, stage_min, stage_max, sort_order)
values
  ('NOV', 'Explorador', 'Você está descobrindo o ritmo que sustenta sua escrita.', 'Um perfil inicial para autores que ainda estão formando rotina, repertório de ferramentas e uma maneira própria de organizar a obra.', 'Conclua sessões reais, organize uma obra e experimente recursos sem pressa. O perfil evolui pelo padrão de uso, nunca por marcar tarefas artificialmente.', '["Jornada guiada de fundamentos","Templates de partida","Recomendações mais simples e contextuais"]', '#4F7D6B', 'archetype-explorer', 0, 19, 10),
  ('BAR', 'Bardo', 'Sessões longas e voz narrativa movem seu processo.', 'O Bardo tende a avançar pela cena, pelo diálogo e pela continuidade emocional da escrita.', 'Aprofunde o planejamento de arcos e registre decisões recorrentes na Enciclopédia.', '["Presets de imersão","Atalhos para cenas e diálogo","Revisões focadas em voz"]', '#A96B45', 'archetype-bard', 20, 49, 20),
  ('TEC', 'Tecelão', 'Você conecta elementos e constrói continuidade.', 'O Tecelão usa relações, fichas e estruturas para manter universos complexos coerentes.', 'Transforme conexões recorrentes em grafos e regras de cânone compartilhadas entre obras.', '["Grafos narrativos","Análise de continuidade","Templates para universos compartilhados"]', '#735D9B', 'archetype-weaver', 50, 74, 30),
  ('CRON', 'Cronista', 'Constância e visão de longo prazo definem seu trabalho.', 'O Cronista mantém projetos extensos vivos com ritmo consistente, histórico e disciplina editorial.', 'Use retrospectivas de projeto e compartilhe processos maduros em espaços colaborativos.', '["Histórico avançado","Painéis de progresso sustentável","Fluxos editoriais completos"]', '#496B86', 'archetype-chronicler', 75, 89, 40),
  ('ORAC', 'Oráculo', 'Experiência transforma estrutura em intenção.', 'O Oráculo domina diferentes ritmos e escolhe ferramentas segundo a necessidade de cada obra.', 'Seu próximo avanço vem de mentoria, colaboração e experimentação consciente.', '["Controles avançados","Laboratórios editoriais","Recursos para mentoria e colaboração"]', '#8A6A32', 'archetype-oracle', 90, 100, 50)
on conflict (code_prefix) do nothing;

create or replace function private.initialize_account_preferences()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  initial_archetype uuid;
begin
  insert into public.user_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  select id into initial_archetype from public.author_archetypes where code_prefix = 'NOV' limit 1;
  if initial_archetype is not null then
    insert into public.user_author_profiles (user_id, archetype_id) values (new.id, initial_archetype) on conflict (user_id) do nothing;
  end if;
  insert into public.user_behavior_profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger profiles_initialize_account_preferences
after insert on public.profiles
for each row execute procedure private.initialize_account_preferences();

insert into public.user_preferences (user_id) select id from public.profiles on conflict (user_id) do nothing;
insert into public.user_author_profiles (user_id, archetype_id)
select profile.id, archetype.id from public.profiles profile cross join public.author_archetypes archetype where archetype.code_prefix = 'NOV'
on conflict (user_id) do nothing;
insert into public.user_behavior_profiles (user_id) select id from public.profiles on conflict (user_id) do nothing;

comment on table public.user_behavior_profiles is 'Internal usage-metadata vector. Never exposed to users and never content-derived without separate consent.';
comment on column public.user_behavior_profiles.usage_vector is 'Normalized 24-dimensional usage metadata vector recalculated by a trusted backend job.';
