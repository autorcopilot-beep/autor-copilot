-- Targets are an administrative catalog. Keep RLS explicit so client roles can
-- never enumerate product internals even if a future grant is added by mistake.
drop policy if exists "Client roles cannot read guide targets" on public.product_guide_targets;
create policy "Client roles cannot read guide targets"
on public.product_guide_targets for select to authenticated
using (false);

create index if not exists product_guide_templates_created_by_idx
  on public.product_guide_templates (created_by) where created_by is not null;
