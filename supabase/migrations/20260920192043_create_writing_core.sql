create type public.writing_document_kind as enum (
  'folder',
  'page',
  'chapter',
  'scene',
  'note',
  'draft'
);

create type public.writing_document_status as enum (
  'draft',
  'review',
  'final'
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Meu livro',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint works_title_length
    check (char_length(btrim(title)) between 1 and 200),
  constraint works_id_owner_unique
    unique (id, owner_id)
);

create table public.writing_documents (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null,
  owner_id uuid not null,
  parent_id uuid,
  kind public.writing_document_kind not null default 'chapter',
  title text not null,
  content_html text not null default '',
  synopsis text not null default '',
  status public.writing_document_status not null default 'draft',
  word_goal integer not null default 0,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint writing_documents_title_length
    check (char_length(btrim(title)) between 1 and 200),
  constraint writing_documents_synopsis_length
    check (char_length(synopsis) <= 20000),
  constraint writing_documents_content_size
    check (octet_length(content_html) <= 5242880),
  constraint writing_documents_word_goal_range
    check (word_goal between 0 and 1000000),
  constraint writing_documents_position_nonnegative
    check (position >= 0),
  constraint writing_documents_work_owner_fk
    foreign key (work_id, owner_id)
    references public.works (id, owner_id)
    on delete cascade,
  constraint writing_documents_identity_scope_unique
    unique (id, work_id, owner_id),
  constraint writing_documents_id_owner_unique
    unique (id, owner_id),
  constraint writing_documents_parent_scope_fk
    foreign key (parent_id, work_id, owner_id)
    references public.writing_documents (id, work_id, owner_id)
    on delete cascade
);

create table public.writing_snapshots (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  owner_id uuid not null,
  title text not null,
  content_html text not null,
  synopsis text not null default '',
  status public.writing_document_status not null,
  created_at timestamptz not null default now(),

  constraint writing_snapshots_title_length
    check (char_length(btrim(title)) between 1 and 200),
  constraint writing_snapshots_content_size
    check (octet_length(content_html) <= 5242880),
  constraint writing_snapshots_document_owner_fk
    foreign key (document_id, owner_id)
    references public.writing_documents (id, owner_id)
    on delete cascade
);

create index works_owner_updated_idx
  on public.works (owner_id, updated_at desc);

create index writing_documents_owner_updated_idx
  on public.writing_documents (owner_id, updated_at desc);

create index writing_documents_tree_idx
  on public.writing_documents (work_id, parent_id, position);

create index writing_documents_owner_kind_idx
  on public.writing_documents (owner_id, kind);

create index writing_snapshots_document_created_idx
  on public.writing_snapshots (document_id, created_at desc);

alter table public.works enable row level security;
alter table public.writing_documents enable row level security;
alter table public.writing_snapshots enable row level security;

revoke all on table public.works from anon, authenticated;
revoke all on table public.writing_documents from anon, authenticated;
revoke all on table public.writing_snapshots from anon, authenticated;

grant select, insert, update, delete on table public.works to authenticated;
grant select, insert, update, delete on table public.writing_documents to authenticated;
grant select, insert, delete on table public.writing_snapshots to authenticated;

create policy "Authors can read their own works"
  on public.works for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own works"
  on public.works for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can update their own works"
  on public.works for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own works"
  on public.works for delete to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can read their own documents"
  on public.writing_documents for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own documents"
  on public.writing_documents for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can update their own documents"
  on public.writing_documents for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own documents"
  on public.writing_documents for delete to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can read their own snapshots"
  on public.writing_snapshots for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Authors can create their own snapshots"
  on public.writing_snapshots for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Authors can delete their own snapshots"
  on public.writing_snapshots for delete to authenticated
  using ((select auth.uid()) = owner_id);

create trigger works_set_updated_at
  before update on public.works
  for each row execute procedure private.set_updated_at();

create trigger writing_documents_set_updated_at
  before update on public.writing_documents
  for each row execute procedure private.set_updated_at();

comment on table public.works is
  'Obras pertencentes a um autor. O conteúdo é dividido em documentos independentes.';

comment on table public.writing_documents is
  'Árvore ordenada de páginas, capítulos, cenas, notas e rascunhos de uma obra.';

comment on table public.writing_snapshots is
  'Versões imutáveis criadas antes de alterações relevantes em um documento.';

;
