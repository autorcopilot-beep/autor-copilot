create type public.writing_goal_type as enum (
  'word_count',
  'chapter_count',
  'deadline'
);

create table public.writing_goals (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null,
  owner_id uuid not null,
  goal_type public.writing_goal_type not null,
  title text not null,
  target_value integer not null default 0,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint writing_goals_title_length
    check (char_length(btrim(title)) between 1 and 120),
  constraint writing_goals_target_range
    check (target_value between 0 and 10000000),
  constraint writing_goals_work_owner_fk
    foreign key (work_id, owner_id)
    references public.works (id, owner_id)
    on delete cascade
);

create index writing_goals_work_due_idx
  on public.writing_goals (work_id, completed_at, due_date);

create index writing_goals_owner_updated_idx
  on public.writing_goals (owner_id, updated_at desc);

alter table public.writing_goals enable row level security;

revoke all on table public.writing_goals from anon, authenticated;
grant select, insert, update, delete on table public.writing_goals to authenticated;

create policy "Authors can read their own writing goals"
  on public.writing_goals for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own writing goals"
  on public.writing_goals for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can update their own writing goals"
  on public.writing_goals for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own writing goals"
  on public.writing_goals for delete to authenticated
  using ((select auth.uid()) = owner_id);

create trigger writing_goals_set_updated_at
  before update on public.writing_goals
  for each row execute procedure private.set_updated_at();

comment on table public.writing_goals is
  'Metas editoriais por obra, acompanhadas com métricas reais do manuscrito.';;
