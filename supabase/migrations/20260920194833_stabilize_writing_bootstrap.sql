alter table public.works
  add column is_primary boolean not null default false;

with ranked_works as (
  select
    id,
    row_number() over (
      partition by owner_id
      order by created_at asc, id asc
    ) as owner_position
  from public.works
)
update public.works as works
set is_primary = ranked_works.owner_position = 1
from ranked_works
where works.id = ranked_works.id;

delete from public.works as works
where not works.is_primary
  and not exists (
    select 1
    from public.writing_documents as documents
    where documents.work_id = works.id
  );

create unique index works_one_primary_per_owner_idx
  on public.works (owner_id)
  where is_primary;

comment on column public.works.is_primary is
  'Identifica a obra inicial usada pelo ambiente de escrita enquanto a biblioteca ainda não seleciona uma obra.';;
