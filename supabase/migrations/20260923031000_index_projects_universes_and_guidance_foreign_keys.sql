create index if not exists story_universes_project_owner_fk_idx
  on public.story_universes (project_id, owner_id);

create index if not exists universe_works_universe_owner_fk_idx
  on public.universe_works (universe_id, owner_id);

create index if not exists universe_works_work_owner_fk_idx
  on public.universe_works (work_id, owner_id);

create index if not exists universe_graph_edges_universe_owner_fk_idx
  on public.universe_graph_edges (universe_id, owner_id);

create index if not exists user_guide_progress_guide_fk_idx
  on public.user_guide_progress (guide_id);
