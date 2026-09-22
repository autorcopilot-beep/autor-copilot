-- More structured reference material for each work, without changing existing mentions.
alter table public.encyclopedia_entries
  add column status text not null default 'draft',
  add column tags text[] not null default '{}',
  add column story_role text not null default '',
  add column appearance text not null default '',
  add column history text not null default '',
  add column connections text not null default '',
  add column rules text not null default '',
  add column is_pinned boolean not null default false,
  add column is_spoiler boolean not null default false;

alter table public.encyclopedia_entries
  add constraint encyclopedia_entries_status_value check (status in ('draft', 'canon', 'archived')),
  add constraint encyclopedia_entries_tags_count check (cardinality(tags) <= 12),
  add constraint encyclopedia_entries_tags_length check (char_length(array_to_string(tags, ',')) <= 500),
  add constraint encyclopedia_entries_story_role_length check (char_length(story_role) <= 500),
  add constraint encyclopedia_entries_appearance_length check (char_length(appearance) <= 4000),
  add constraint encyclopedia_entries_history_length check (char_length(history) <= 8000),
  add constraint encyclopedia_entries_connections_length check (char_length(connections) <= 4000),
  add constraint encyclopedia_entries_rules_length check (char_length(rules) <= 4000);

create index encyclopedia_entries_work_status_updated_idx
  on public.encyclopedia_entries (work_id, status, updated_at desc);

comment on column public.encyclopedia_entries.status is 'Situação editorial: rascunho, cânone ou arquivado.';
comment on column public.encyclopedia_entries.tags is 'Etiquetas livres de organização dentro da obra.';
