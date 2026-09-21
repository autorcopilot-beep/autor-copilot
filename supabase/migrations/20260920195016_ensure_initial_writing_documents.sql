create or replace function public.ensure_initial_writing_documents(target_work_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null or not exists (
    select 1
    from public.works
    where id = target_work_id
      and owner_id = caller_id
  ) then
    raise exception 'Writing work is unavailable'
      using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_work_id::text, 0));

  if not exists (
    select 1
    from public.writing_documents
    where work_id = target_work_id
      and owner_id = caller_id
  ) then
    insert into public.writing_documents (
      work_id,
      owner_id,
      parent_id,
      kind,
      title,
      content_html,
      synopsis,
      status,
      word_goal,
      position
    )
    values
      (target_work_id, caller_id, null, 'chapter', 'Capítulo 1', '<p>Comece a escrever sua história aqui.</p>', '', 'draft', 1800, 0),
      (target_work_id, caller_id, null, 'chapter', 'Capítulo 2', '', '', 'draft', 1800, 1);
  end if;
end;
$$;

revoke all on function public.ensure_initial_writing_documents(uuid) from public, anon;
grant execute on function public.ensure_initial_writing_documents(uuid) to authenticated;

comment on function public.ensure_initial_writing_documents(uuid) is
  'Cria os documentos iniciais uma única vez, serializando requisições concorrentes por obra.';;
