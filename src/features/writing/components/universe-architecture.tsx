'use client';

import { ArrowRight, BookOpen, Check, FolderKanban, GitBranch, Link2, Network, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { EncyclopediaEntry } from '@/features/writing/types';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.generated';

type CreativeProject = Database['public']['Tables']['creative_projects']['Row'];
type StoryUniverse = Database['public']['Tables']['story_universes']['Row'];
type UniverseWork = Database['public']['Tables']['universe_works']['Row'];
type GraphEdge = Database['public']['Tables']['universe_graph_edges']['Row'];

export function UniverseArchitecture({ ownerId, workId, workTitle, entries, standalone = false }: { ownerId: string; workId: string; workTitle: string; entries: EncyclopediaEntry[]; standalone?: boolean }) {
  const supabase = useMemo(() => createClient(), []);
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [universes, setUniverses] = useState<StoryUniverse[]>([]);
  const [links, setLinks] = useState<UniverseWork[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedUniverse, setSelectedUniverse] = useState('');
  const [projectName, setProjectName] = useState(workTitle);
  const [universeName, setUniverseName] = useState(`Universo de ${workTitle}`);
  const [relation, setRelation] = useState('conhece');
  const [sourceId, setSourceId] = useState(entries[0]?.id ?? '');
  const [targetId, setTargetId] = useState(entries[1]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [{ data: projectRows }, { data: universeRows }, { data: linkRows }, { data: edgeRows }] = await Promise.all([
      supabase.from('creative_projects').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false }),
      supabase.from('story_universes').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false }),
      supabase.from('universe_works').select('*').eq('owner_id', ownerId),
      supabase.from('universe_graph_edges').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false }),
    ]);
    setProjects(projectRows ?? []); setUniverses(universeRows ?? []); setLinks(linkRows ?? []); setEdges(edgeRows ?? []);
    const linked = (linkRows ?? []).find((item) => item.work_id === workId)?.universe_id;
    setSelectedUniverse((current) => current || linked || universeRows?.[0]?.id || '');
  }, [ownerId, supabase, workId]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function createStructure() {
    if (!projectName.trim() || !universeName.trim()) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { data: project, error: projectError } = await supabase.from('creative_projects').insert({ owner_id: ownerId, name: projectName.trim(), description: `Projeto editorial que reúne ${workTitle} e seus universos.` }).select('*').single();
      if (projectError) throw projectError;
      const { data: universe, error: universeError } = await supabase.from('story_universes').insert({ owner_id: ownerId, project_id: project.id, name: universeName.trim(), description: `Cânone e continuidade de ${workTitle}.` }).select('*').single();
      if (universeError) throw universeError;
      const { error: linkError } = await supabase.from('universe_works').insert({ owner_id: ownerId, universe_id: universe.id, work_id: workId, continuity_role: 'primary', chronology_order: 1 });
      if (linkError) throw linkError;
      setSelectedUniverse(universe.id); setNotice('Projeto, universo e obra foram conectados.'); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível criar a arquitetura.'); }
    finally { setBusy(false); }
  }

  async function linkCurrentWork(universeId: string) {
    setBusy(true); setError('');
    const { error: linkError } = await supabase.from('universe_works').upsert({ owner_id: ownerId, universe_id: universeId, work_id: workId, continuity_role: 'primary', chronology_order: 1 }, { onConflict: 'universe_id,work_id' });
    if (linkError) setError(linkError.message); else { setSelectedUniverse(universeId); setNotice('Obra conectada ao universo.'); await load(); }
    setBusy(false);
  }

  async function addRelation() {
    if (!selectedUniverse || !sourceId || !targetId || sourceId === targetId || !relation.trim()) return;
    setBusy(true); setError('');
    const { error: edgeError } = await supabase.from('universe_graph_edges').insert({ owner_id: ownerId, universe_id: selectedUniverse, source_kind: 'entry', source_id: sourceId, target_kind: 'entry', target_id: targetId, relation_type: relation.trim().toLowerCase().replace(/\s+/g, '_'), label: relation.trim(), direction: 'directed' });
    if (edgeError) setError(edgeError.message); else { setNotice('Relação adicionada ao grafo.'); await load(); }
    setBusy(false);
  }

  async function deleteRelation(edgeId: string) {
    setBusy(true); setError('');
    const { error: deleteError } = await supabase.from('universe_graph_edges').delete().eq('id', edgeId).eq('owner_id', ownerId);
    if (deleteError) setError(deleteError.message); else { setNotice('Relação removida do grafo.'); await load(); }
    setBusy(false);
  }

  const selected = universes.find((item) => item.id === selectedUniverse);
  const linkedUniverseIds = new Set(links.filter((item) => item.work_id === workId).map((item) => item.universe_id));
  const visibleEdges = edges.filter((item) => item.universe_id === selectedUniverse);
  const entryName = (id: string) => entries.find((entry) => entry.id === id)?.name ?? 'Elemento removido';
  const graphEntries = entries.slice(0, 12);
  const graphNodes = graphEntries.map((entry, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(graphEntries.length, 1) - Math.PI / 2;
    return { entry, x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 34 };
  });
  const graphNode = new Map(graphNodes.map((node) => [node.entry.id, node]));

  return <div className={cn('space-y-5', !standalone && 'mt-5')} data-tour={standalone ? 'relations-canvas' : 'universe-architecture'}>
    <section className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-soft"><div className="grid lg:grid-cols-[1.2fr_.8fr]"><div className="p-6 sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Arquitetura narrativa</p><h2 className="mt-2 max-w-xl font-serif text-3xl font-semibold text-ink">Da coleção de livros ao detalhe que aparece em cena.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-muted">Um <strong className="text-ink">Projeto</strong> reúne sua iniciativa editorial. Cada projeto pode conter vários <strong className="text-ink">Universos</strong>, e cada universo compartilha cânone entre uma ou mais <strong className="text-ink">Obras</strong>. As fichas formam o grafo vivo de cada universo.</p><div className="mt-7 flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-accent-subtle px-3 py-2 font-semibold text-accent">Projeto</span><ArrowRight className="size-4 text-muted" /><span className="rounded-full border border-line px-3 py-2">Universo</span><ArrowRight className="size-4 text-muted" /><span className="rounded-full border border-line px-3 py-2">Obras</span><ArrowRight className="size-4 text-muted" /><span className="rounded-full border border-line px-3 py-2">Fichas e relações</span></div></div><div className="border-t border-line bg-accent-subtle/30 p-6 sm:p-8 lg:border-l lg:border-t-0"><Network className="size-6 text-accent" /><p className="mt-4 text-sm font-semibold text-ink">O que um universo protege?</p><ul className="mt-3 space-y-2 text-xs leading-6 text-muted"><li>• Regras de cânone e continuidade.</li><li>• Cronologia entre livros, contos e spin-offs.</li><li>• Relações entre personagens, lugares e eventos.</li><li>• Contexto disponível para menções com @.</li></ul></div></div></section>

    {!projects.length ? <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8"><div className="flex items-start gap-4"><span className="flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent"><FolderKanban className="size-5" /></span><div><h3 className="font-serif text-2xl font-semibold text-ink">Criar a casa desta obra</h3><p className="mt-1 text-sm text-muted">Você pode renomear e expandir esta estrutura quando publicar novos livros.</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-xs font-semibold text-ink">Nome do projeto<input value={projectName} onChange={(event) => setProjectName(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-line bg-editor px-3 text-sm" /></label><label className="text-xs font-semibold text-ink">Primeiro universo<input value={universeName} onChange={(event) => setUniverseName(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-line bg-editor px-3 text-sm" /></label></div><button type="button" disabled={busy} onClick={() => void createStructure()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent disabled:opacity-50"><Sparkles className="size-4" />Criar e conectar esta obra</button></section> : <div className="grid gap-5 xl:grid-cols-[21rem_minmax(0,1fr)]"><aside className="space-y-4">{projects.map((project) => <article key={project.id} className="rounded-2xl border border-line bg-surface p-5"><div className="flex items-center gap-3"><FolderKanban className="size-5 text-accent" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-accent">Projeto</p><h3 className="font-serif text-lg font-semibold text-ink">{project.name}</h3></div></div><div className="mt-4 space-y-2">{universes.filter((universe) => universe.project_id === project.id).map((universe) => <button key={universe.id} type="button" onClick={() => setSelectedUniverse(universe.id)} className={cn('flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left', selectedUniverse === universe.id ? 'border-accent bg-accent-subtle' : 'border-line bg-editor hover:border-accent')}><Network className="size-4 text-accent" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{universe.name}</span><span className="block text-[10px] text-muted">{links.filter((item) => item.universe_id === universe.id).length} obra(s)</span></span>{linkedUniverseIds.has(universe.id) && <Check className="size-4 text-accent" />}</button>)}</div></article>)}</aside>
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">{selected ? <><div className="flex flex-wrap items-start gap-4"><span className="flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent"><Network className="size-5" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-accent">Universo selecionado</p><h3 className="font-serif text-2xl font-semibold text-ink">{selected.name}</h3><p className="mt-1 text-xs text-muted">Política de cânone: {selected.canon_policy === 'shared' ? 'compartilhado' : selected.canon_policy}</p></div>{!linkedUniverseIds.has(selected.id) && <button type="button" disabled={busy} onClick={() => void linkCurrentWork(selected.id)} className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-accent"><Link2 className="mr-1.5 inline size-3.5" />Conectar {workTitle}</button>}</div>
        <div className="relative mt-7 min-h-[30rem] overflow-hidden rounded-2xl border border-line bg-editor" data-tour="relations-canvas"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, var(--color-line) 1px, transparent 1px)', backgroundSize: '18px 18px' }} /><svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="relation-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="var(--color-accent)" /></marker></defs>{visibleEdges.map((edge) => { const source = graphNode.get(edge.source_id); const target = graphNode.get(edge.target_id); return source && target ? <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="var(--color-accent)" strokeWidth=".45" strokeOpacity=".65" markerEnd="url(#relation-arrow)" /> : null; })}</svg><div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-accent bg-surface px-5 py-3 text-center shadow-soft"><Network className="mx-auto size-5 text-accent" /><strong className="mt-1 block max-w-40 truncate text-sm">{selected.name}</strong><span className="mt-1 block text-[10px] text-muted"><BookOpen className="mr-1 inline size-3" />{workTitle}</span></div>{graphNodes.map((node) => <button key={node.entry.id} type="button" onClick={() => setSourceId(node.entry.id)} className={cn('absolute z-10 max-w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-surface px-3 py-2 text-xs shadow-soft transition-transform hover:scale-105', sourceId === node.entry.id ? 'border-accent text-accent' : 'border-line text-ink')} style={{ left: `${node.x}%`, top: `${node.y}%` }} title={node.entry.summary || node.entry.name}>{node.entry.name}</button>)}{graphEntries.length === 0 && <div className="absolute inset-0 grid place-items-center"><p className="mt-28 max-w-xs text-center text-xs leading-6 text-muted">Crie fichas na Enciclopédia para formar os primeiros nós deste universo.</p></div>}</div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Relações do grafo</p>{visibleEdges.length ? <div className="mt-3 space-y-2">{visibleEdges.map((edge) => <div key={edge.id} className="flex items-center gap-2 rounded-xl border border-line bg-editor px-3 py-2 text-xs"><span className="truncate font-semibold">{entryName(edge.source_id)}</span><GitBranch className="size-3.5 shrink-0 text-accent" /><span className="rounded-full bg-accent-subtle px-2 py-1 text-[10px] text-accent">{edge.label || edge.relation_type}</span><ArrowRight className="size-3.5 shrink-0 text-muted" /><span className="truncate font-semibold">{entryName(edge.target_id)}</span><button type="button" disabled={busy} onClick={() => void deleteRelation(edge.id)} className="ml-auto grid size-7 shrink-0 place-items-center rounded-full text-muted hover:bg-danger-subtle hover:text-danger" aria-label="Remover relação"><Trash2 className="size-3.5" /></button></div>)}</div> : <p className="mt-3 text-xs leading-6 text-muted">As fichas já pertencem ao universo. Adicione relações para registrar vínculos explícitos.</p>}</div><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Nova relação</p>{entries.length >= 2 ? <div className="mt-3 grid gap-2"><select value={sourceId} onChange={(event) => setSourceId(event.target.value)} className="min-h-10 rounded-xl border border-line bg-editor px-3 text-xs">{entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select><input value={relation} onChange={(event) => setRelation(event.target.value)} placeholder="relação: conhece, pertence, protege…" className="min-h-10 rounded-xl border border-line bg-editor px-3 text-xs" /><select value={targetId} onChange={(event) => setTargetId(event.target.value)} className="min-h-10 rounded-xl border border-line bg-editor px-3 text-xs">{entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select><button type="button" disabled={busy || sourceId === targetId} onClick={() => void addRelation()} className="min-h-10 rounded-xl bg-accent px-3 text-xs font-semibold text-on-accent disabled:opacity-40"><Plus className="mr-1 inline size-3.5" />Adicionar ao grafo</button></div> : <p className="mt-3 text-xs leading-6 text-muted">Crie ao menos duas fichas para desenhar uma relação.</p>}</div></div>
      </> : <p className="text-sm text-muted">Selecione um universo.</p>}</section></div>}
    {(notice || error) && <p role="status" className={cn('rounded-xl border px-4 py-3 text-xs', error ? 'border-danger/20 bg-danger-subtle text-danger' : 'border-success/20 bg-success-subtle text-success')}>{error || notice}</p>}
  </div>;
}
