alter table public.encyclopedia_entries
  add column profile_answers jsonb not null default '{}'::jsonb;

alter table public.encyclopedia_entries
  add constraint encyclopedia_entries_profile_answers_shape
    check (jsonb_typeof(profile_answers) = 'object' and pg_column_size(profile_answers) <= 16000);

comment on column public.encyclopedia_entries.profile_answers is
  'Respostas estruturadas a perguntas editoriais específicas do tipo da ficha.';
