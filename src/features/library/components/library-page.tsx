import { Archive, ArrowRight, BookOpen, BookOpenText, Check, ChevronRight, Clock3, FolderOpen, Heart, Library, MoreHorizontal, Search, Star, Target, Undo2 } from 'lucide-react';
import Link from 'next/link';

import { Badge, buttonVariants, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui';
import { setArchived, setCatalogMembership, setWorkStatus, toggleFavorite, deleteCatalog } from '@/features/library/actions';
import { NewCatalogDialog, NewWorkDialog } from '@/features/library/components/library-create-dialogs';
import type { LibraryCatalog, LibraryView, LibraryWork } from '@/features/library/types';
import { workStatusLabels } from '@/features/library/types';
import { cn } from '@/lib/cn';

const viewMeta: Record<LibraryView, { eyebrow: string; title: string; description: string }> = {
  all: { eyebrow: 'Acervo pessoal', title: 'Todas as obras', description: 'Sua estante completa, do primeiro esboço ao livro terminado.' },
  recent: { eyebrow: 'Em andamento', title: 'Obras recentes', description: 'Retome rapidamente os manuscritos que receberam atenção por último.' },
  favorites: { eyebrow: 'Seleção do autor', title: 'Obras favoritas', description: 'Os projetos que você deseja manter sempre ao alcance.' },
  archived: { eyebrow: 'Arquivo editorial', title: 'Obras arquivadas', description: 'Projetos guardados permanecem seguros e podem voltar à estante.' },
  catalogs: { eyebrow: 'Coleções', title: 'Catálogos', description: 'Organize séries, universos e projetos editoriais do seu jeito.' },
};

const toneClasses: Record<string, string> = {
  sage: 'from-[#315d4a] via-[#477a62] to-[#244638]', ink: 'from-[#202a35] via-[#344452] to-[#151c24]',
  clay: 'from-[#884c3d] via-[#ad6854] to-[#67372f]', ochre: 'from-[#8a6428] via-[#b78a3d] to-[#67481d]',
  plum: 'from-[#68405f] via-[#885a7e] to-[#482c43]', ocean: 'from-[#295a69] via-[#39778a] to-[#1c404c]',
};

function formatNumber(value: number) { return new Intl.NumberFormat('pt-BR').format(value); }
function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }

function HiddenActionFields({ workId, returnTo }: { workId: string; returnTo: string }) {
  return <><input type="hidden" name="workId" value={workId} /><input type="hidden" name="returnTo" value={returnTo} /></>;
}

function WorkActions({ work, catalogs, returnTo }: { work: LibraryWork; catalogs: LibraryCatalog[]; returnTo: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Ações de ${work.title}`} className="flex size-9 items-center justify-center rounded-full bg-black/15 text-white backdrop-blur-sm transition-colors hover:bg-black/30"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>{work.title}</DropdownMenuLabel>
        <DropdownMenuItem asChild><Link href={`/write/editor?work=${work.id}`}><BookOpenText className="size-4" />Abrir no editor</Link></DropdownMenuItem>
        <form action={toggleFavorite}><HiddenActionFields workId={work.id} returnTo={returnTo} /><input type="hidden" name="favorite" value={String(!work.isFavorite)} /><DropdownMenuItem asChild><button type="submit" className="w-full"><Heart className={cn('size-4', work.isFavorite && 'fill-current')} />{work.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</button></DropdownMenuItem></form>
        <DropdownMenuSub><DropdownMenuSubTrigger><Target className="size-4" />Alterar estágio</DropdownMenuSubTrigger><DropdownMenuSubContent>{Object.entries(workStatusLabels).map(([status, label]) => <form action={setWorkStatus} key={status}><HiddenActionFields workId={work.id} returnTo={returnTo} /><input type="hidden" name="status" value={status} /><DropdownMenuItem asChild><button type="submit" className="w-full">{work.status === status && <Check className="size-4" />}{label}</button></DropdownMenuItem></form>)}</DropdownMenuSubContent></DropdownMenuSub>
        {catalogs.length > 0 && <DropdownMenuSub><DropdownMenuSubTrigger><FolderOpen className="size-4" />Catálogos</DropdownMenuSubTrigger><DropdownMenuSubContent>{catalogs.map((catalog) => { const assigned = work.catalogIds.includes(catalog.id); return <form action={setCatalogMembership} key={catalog.id}><HiddenActionFields workId={work.id} returnTo={returnTo} /><input type="hidden" name="catalogId" value={catalog.id} /><input type="hidden" name="add" value={String(!assigned)} /><DropdownMenuItem asChild><button type="submit" className="w-full">{assigned && <Check className="size-4" />}{catalog.name}</button></DropdownMenuItem></form>; })}</DropdownMenuSubContent></DropdownMenuSub>}
        <DropdownMenuSeparator />
        <form action={setArchived}><HiddenActionFields workId={work.id} returnTo={returnTo} /><input type="hidden" name="archive" value={String(!work.archivedAt)} /><DropdownMenuItem asChild><button type="submit" className="w-full">{work.archivedAt ? <Undo2 className="size-4" /> : <Archive className="size-4" />}{work.archivedAt ? 'Restaurar obra' : 'Arquivar obra'}</button></DropdownMenuItem></form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WorkCard({ work, catalogs, returnTo }: { work: LibraryWork; catalogs: LibraryCatalog[]; returnTo: string }) {
  const progress = work.wordGoal ? Math.min(100, Math.round((work.wordCount / work.wordGoal) * 100)) : 0;
  return (
    <article className="group grid min-h-[20rem] grid-rows-[1fr_auto] overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-floating">
      <div className={cn('relative isolate min-h-56 overflow-hidden bg-gradient-to-br p-5 text-white', toneClasses[work.coverTone] ?? toneClasses.sage)}>
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:repeating-linear-gradient(105deg,transparent_0,transparent_3px,rgba(255,255,255,.08)_4px,transparent_5px)]" />
        <div className="absolute inset-y-0 left-4 w-px bg-white/20 shadow-[3px_0_8px_rgba(0,0,0,.25)]" />
        <div className="flex justify-between gap-3 pl-4"><span className="rounded-full border border-white/25 bg-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm">{work.genre}</span><WorkActions work={work} catalogs={catalogs} returnTo={returnTo} /></div>
        <Link href={`/write/editor?work=${work.id}`} className="flex h-[calc(100%-2.5rem)] flex-col justify-center pl-4 pr-2 outline-none">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">Autor Copilot</p>
          <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight drop-shadow-sm">{work.title}</h2>
          {work.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">{work.subtitle}</p>}
          <span className="mt-5 h-px w-12 bg-white/50" />
        </Link>
        {work.isFavorite && <Star className="absolute bottom-4 right-4 size-4 fill-white/80 text-white/80" aria-label="Favorita" />}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3"><Badge className="text-[10px]">{workStatusLabels[work.status]}</Badge><span className="text-[11px] text-muted">Editada {formatDate(work.updatedAt)}</span></div>
        <div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-ink">{formatNumber(work.wordCount)} palavras</p><p className="mt-0.5 text-xs text-muted">{work.documentCount} {work.documentCount === 1 ? 'documento' : 'documentos'}</p></div><span className="text-xs font-medium text-accent">{progress}%</span></div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} /></div>
      </div>
    </article>
  );
}

export function LibraryPage({ view, works, catalogs, stats, query = '', sort = 'updated', catalogId }: { view: LibraryView; works: LibraryWork[]; catalogs: LibraryCatalog[]; stats: { active: number; favorites: number; archived: number; words: number }; query?: string; sort?: string; catalogId?: string }) {
  const currentCatalog = catalogId ? catalogs.find((catalog) => catalog.id === catalogId) : undefined;
  const meta = currentCatalog ? { eyebrow: 'Catálogo', title: currentCatalog.name, description: currentCatalog.description || 'Uma coleção editorial da sua biblioteca.' } : viewMeta[view];
  const params = new URLSearchParams(); if (query) params.set('q', query); if (sort !== 'updated') params.set('sort', sort);
  const currentPath = catalogId ? `/library/catalogs/${catalogId}` : `/library/${view}`;
  const returnTo = `${currentPath}${params.size ? `?${params}` : ''}`;
  const tabs = [['all', 'Todas'], ['recent', 'Recentes'], ['favorites', 'Favoritas'], ['archived', 'Arquivadas'], ['catalogs', 'Catálogos']] as const;
  return (
    <div className="mx-auto w-full max-w-7xl py-4 sm:py-7">
      <section className="relative isolate overflow-hidden rounded-card border border-line bg-editor px-6 py-8 shadow-soft sm:px-10 sm:py-10">
        <div className="absolute inset-0 -z-20 bg-[url('/images/kit_marca/03_backgrounds/papel-claro.svg')] bg-cover opacity-45 dark:opacity-[0.06]" />
        <div className="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-accent-subtle blur-3xl" />
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{meta.eyebrow}</p><h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">{meta.title}</h1><p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{meta.description}</p></div>
          <div className="flex flex-wrap gap-2"><NewCatalogDialog /><NewWorkDialog /></div>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-control border border-line bg-line sm:grid-cols-4">
          <div className="bg-surface/85 p-4"><Library className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{stats.active}</p><p className="text-xs text-muted">obras ativas</p></div>
          <div className="bg-surface/85 p-4"><BookOpen className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{formatNumber(stats.words)}</p><p className="text-xs text-muted">palavras escritas</p></div>
          <div className="bg-surface/85 p-4"><Heart className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{stats.favorites}</p><p className="text-xs text-muted">favoritas</p></div>
          <div className="bg-surface/85 p-4"><Archive className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{stats.archived}</p><p className="text-xs text-muted">arquivadas</p></div>
        </div>
      </section>

      <nav className="workspace-scrollbar mt-7 flex gap-1 overflow-x-auto border-b border-line" aria-label="Seções da biblioteca">{tabs.map(([key, label]) => <Link key={key} href={`/library/${key}`} className={cn('whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors', (!catalogId && view === key) || (catalogId && key === 'catalogs') ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink')}>{label}</Link>)}</nav>

      {view === 'catalogs' && !catalogId && <section className="mt-8" aria-labelledby="catalogs-heading"><div className="flex items-end justify-between border-b border-line pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Organização</p><h2 id="catalogs-heading" className="mt-1 font-serif text-2xl font-semibold">Seus catálogos</h2></div><span className="text-xs text-muted">{catalogs.length} coleções</span></div>{catalogs.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{catalogs.map((catalog) => <Link key={catalog.id} href={`/library/catalogs/${catalog.id}`} className="group relative overflow-hidden rounded-card border border-line bg-surface p-5 shadow-soft transition-colors hover:border-accent"><span className={cn('absolute inset-y-0 left-0 w-1 bg-gradient-to-b', toneClasses[catalog.color] ?? toneClasses.sage)} /><FolderOpen className="size-5 text-accent" /><h3 className="mt-5 font-serif text-xl font-semibold text-ink">{catalog.name}</h3><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted">{catalog.description || 'Catálogo editorial personalizado.'}</p><div className="mt-5 flex items-center justify-between text-xs text-muted"><span>{catalog.workCount} {catalog.workCount === 1 ? 'obra' : 'obras'}</span><ChevronRight className="size-4 transition-transform group-hover:translate-x-1" /></div></Link>)}</div> : <div className="mt-5 border-l-2 border-accent py-3 pl-5"><p className="font-serif text-xl text-ink">Crie sua primeira coleção.</p><p className="mt-1 text-sm text-muted">Catálogos ajudam a reunir séries, universos e projetos relacionados.</p></div>}</section>}

      {(view !== 'catalogs' || catalogId) && <>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form action={currentPath} className="flex min-w-0 flex-1 gap-2 sm:max-w-xl"><label className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" /><input type="search" name="q" defaultValue={query} placeholder="Buscar por título, gênero ou sinopse" className="min-h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm shadow-soft outline-none focus:border-accent" /></label><button className={cn(buttonVariants({ variant: 'secondary' }), 'rounded-full')} type="submit">Buscar</button></form>
          <form action={currentPath} className="flex gap-2"><input type="hidden" name="q" value={query} /><select name="sort" defaultValue={sort} className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm shadow-soft"><option value="updated">Atualizadas recentemente</option><option value="created">Criadas recentemente</option><option value="title">Título A–Z</option></select><button type="submit" className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm font-medium hover:border-accent">Ordenar</button></form>
        </div>
        {currentCatalog && <div className="mt-5 flex justify-end"><form action={deleteCatalog}><input type="hidden" name="catalogId" value={currentCatalog.id} /><button type="submit" className="text-xs text-danger hover:underline">Apagar catálogo</button></form></div>}
        {works.length ? <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Obras da biblioteca">{works.map((work) => <WorkCard key={work.id} work={work} catalogs={catalogs} returnTo={returnTo} />)}</section> : <section className="mt-6 flex min-h-64 items-center rounded-card border border-dashed border-line-strong bg-surface-muted/50 p-8"><div className="max-w-md"><BookOpen className="size-7 text-accent" /><h2 className="mt-4 font-serif text-2xl font-semibold text-ink">Nenhuma obra nesta estante</h2><p className="mt-2 text-sm leading-relaxed text-muted">{query ? 'A busca não encontrou correspondências. Experimente outro termo.' : view === 'archived' ? 'Quando você arquivar um projeto, ele ficará guardado aqui.' : 'Crie uma obra e comece a preencher sua primeira lombada.'}</p><div className="mt-5"><NewWorkDialog /></div></div></section>}
      </>}

      <footer className="mt-10 flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-2"><Clock3 className="size-3.5" />A biblioteca é atualizada junto com o manuscrito.</span><Link href="/write/editor" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">Voltar ao último texto<ArrowRight className="size-3.5" /></Link></footer>
    </div>
  );
}
