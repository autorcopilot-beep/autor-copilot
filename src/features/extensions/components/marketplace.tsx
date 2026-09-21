'use client';

import { Blocks, Cable, Check, ChevronRight, Download, Gauge, LoaderCircle, LockKeyhole, PackageOpen, Puzzle, Search, Settings2, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui';
import { defaultExtensionRuntime, extensionCatalog, extensionCategoryLabels, extensionRuntimeStorageKey, type ExtensionCategory, type ExtensionId, type ExtensionProductKind, type ExtensionRuntimeState } from '@/features/extensions/catalog';
import { defaultMentionExtensionSettings, mentionExtensionStorageKey, parseMentionExtensionSettings } from '@/features/extensions/mention-settings';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';

type CategoryFilter = 'all' | ExtensionCategory | 'installed';
type MarketplaceSection = ExtensionProductKind;

export type MarketplaceControl = {
  id: ExtensionId;
  productKind: string;
  priceModel: string;
  priceCents: number;
  currency: string;
  tags: string[];
  mediaUrl: string;
  mediaType: string;
  acquired: boolean;
  canInstall: boolean;
};

function priceLabel(priceModel: string, priceCents: number, currency: string) {
  if (priceModel === 'free') return 'Gratuito';
  if (priceModel === 'pro_included') return 'Incluso no Pro';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(priceCents / 100);
}

function ManuscriptPreview({ extensionId }: { extensionId: ExtensionId }) {
  return <div className="rounded-card border border-line bg-editor p-5 shadow-inner">
    <div className="mb-4 flex items-center justify-between border-b border-line pb-3"><span className="font-serif text-sm font-semibold text-ink">Capítulo 4</span><span className="text-[10px] uppercase tracking-wider text-muted">Prévia no manuscrito</span></div>
    <div className="font-serif text-[15px] leading-8 text-ink">
      {extensionId === 'lab.context-mentions' ? <>Amélia deixou a carta sobre a mesa de <span className="rounded bg-accent-subtle px-1.5 py-0.5 font-sans text-xs font-semibold text-accent">@Biblioteca Norte</span>, certa de que alguém compreenderia o aviso.</> : extensionId === 'lab.reference-guardian' ? <>A referência <span className="underline decoration-warning decoration-wavy underline-offset-4">Casa de Vidro</span> precisa ser reconciliada com a Enciclopédia.</> : extensionId === 'lab.manuscript-metrics' ? <div className="grid grid-cols-3 gap-2 font-sans"><div className="rounded-control bg-surface p-3"><strong className="block text-base">1.842</strong><span className="text-[10px] text-muted">palavras</span></div><div className="rounded-control bg-surface p-3"><strong className="block text-base">3</strong><span className="text-[10px] text-muted">entidades</span></div><div className="rounded-control bg-surface p-3"><strong className="block text-base">62%</strong><span className="text-[10px] text-muted">da meta</span></div></div> : extensionId === 'lab.typewriter-mode' ? <><span className="text-muted/55">A página avança sem deslocar seu olhar.</span><br /><span className="rounded bg-accent-subtle px-1">A linha em escrita permanece no centro.</span></> : <><span className="text-muted/40">Os controles desaparecem aos poucos.</span><br />Só o manuscrito permanece diante de você.</>}
    </div>
  </div>;
}

function MotionPreview({ mediaType, mediaUrl, title }: { mediaType: string; mediaUrl: string; title: string }) {
  if (!mediaUrl || mediaType === 'none') return null;
  return <section className="mt-6"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Demonstração em movimento</p><div className="relative aspect-video overflow-hidden rounded-card border border-line bg-surface-muted">{mediaType === 'mp4' ? <video src={mediaUrl} controls muted loop playsInline preload="metadata" className="size-full object-cover" aria-label={`Demonstração de ${title}`} /> : <Image src={mediaUrl} alt={`Demonstração de ${title}`} fill unoptimized className="object-cover" sizes="(max-width: 768px) 100vw, 46rem" />}</div></section>;
}

export function Marketplace({ controls, installationState, catalogBacked = false }: { controls?: MarketplaceControl[]; installationState?: Partial<ExtensionRuntimeState>; catalogBacked?: boolean }) {
  const searchRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const [runtime, setRuntime] = useState<ExtensionRuntimeState>(defaultExtensionRuntime);
  const [hydrated, setHydrated] = useState(false);
  const [pendingId, setPendingId] = useState<ExtensionId | null>(null);
  const [pendingCollection, setPendingCollection] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [section, setSection] = useState<MarketplaceSection>('extension');
  const [selectedId, setSelectedId] = useState<ExtensionId>('lab.context-mentions');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mentionSettings, setMentionSettings] = useState(defaultMentionExtensionSettings);
  const controlMap = useMemo(() => new Map((controls ?? []).map((control) => [control.id, control])), [controls]);
  const catalog = useMemo(() => {
    if (!controls) return extensionCatalog;
    return extensionCatalog.filter((extension) => controlMap.has(extension.id)).map((extension) => {
      const control = controlMap.get(extension.id)!;
      return { ...extension, productKind: control.productKind as ExtensionProductKind, priceModel: control.priceModel as typeof extension.priceModel, priceCents: control.priceCents, currency: control.currency, tags: control.tags, mediaUrl: control.mediaUrl, mediaType: control.mediaType as typeof extension.mediaType };
    });
  }, [controlMap, controls]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = Object.fromEntries(Object.keys(defaultExtensionRuntime).map((rawId) => {
        const id = rawId as ExtensionId;
        const authorized = catalogBacked && controlMap.get(id)?.canInstall && installationState?.[id] === true;
        return [id, Boolean(authorized)];
      })) as ExtensionRuntimeState;
      setRuntime(next);
      setMentionSettings(parseMentionExtensionSettings(window.localStorage.getItem(mentionExtensionStorageKey)));
      window.localStorage.setItem(extensionRuntimeStorageKey, JSON.stringify(next));
      setHydrated(true);
    }, 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.clearTimeout(timer); window.removeEventListener('keydown', onKeyDown); };
  }, [catalogBacked, controlMap, installationState]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return catalog.filter((extension) => {
      if (extension.productKind !== section) return false;
      if (category === 'installed' && !runtime[extension.id]) return false;
      if (category !== 'all' && category !== 'installed' && extension.category !== category) return false;
      return !normalized || [extension.name, extension.description, extension.author, ...extension.tags].some((value) => value.toLocaleLowerCase('pt-BR').includes(normalized));
    });
  }, [catalog, category, query, runtime, section]);
  const selected = catalog.find((extension) => extension.id === selectedId) ?? catalog[0] ?? extensionCatalog[0];
  const selectedControl = controlMap.get(selected.id);
  const installedCount = Object.values(runtime).filter(Boolean).length;

  function openDetails(id: ExtensionId) {
    setSelectedId(id);
    setErrorMessage('');
    setDrawerOpen(true);
  }

  async function setInstalled(id: ExtensionId, installed: boolean) {
    const control = controlMap.get(id);
    if (!catalogBacked || !control?.canInstall) {
      setErrorMessage(control?.acquired === false ? 'Esta extensão precisa ser adquirida antes da ativação.' : 'Esta extensão não está disponível para sua conta.');
      return;
    }
    setPendingId(id);
    setErrorMessage('');
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setErrorMessage('Sua sessão expirou. Entre novamente para alterar extensões.');
      setPendingId(null);
      return;
    }
    const { error } = await supabase.from('user_extension_installations').upsert({ user_id: data.user.id, extension_id: id, is_active: installed }, { onConflict: 'user_id,extension_id' });
    if (error) {
      setErrorMessage(error.message.includes('row-level security') ? 'Sua conta não possui autorização para ativar esta extensão.' : 'Não foi possível salvar esta alteração agora.');
      setPendingId(null);
      return;
    }
    const next = { ...runtime, [id]: installed };
    setRuntime(next);
    window.localStorage.setItem(extensionRuntimeStorageKey, JSON.stringify(next));
    setPendingId(null);
  }

  async function installFeaturedCollection() {
    const ids = (['lab.context-mentions', 'lab.reference-guardian', 'lab.manuscript-metrics'] as ExtensionId[]).filter((id) => controlMap.get(id)?.canInstall);
    if (!catalogBacked || !ids.length) return setErrorMessage('A coleção não está disponível para sua conta.');
    setPendingCollection(true);
    setErrorMessage('');
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setPendingCollection(false);
      return setErrorMessage('Sua sessão expirou. Entre novamente para instalar a coleção.');
    }
    const { error } = await supabase.from('user_extension_installations').upsert(ids.map((extensionId) => ({ user_id: data.user!.id, extension_id: extensionId, is_active: true })), { onConflict: 'user_id,extension_id' });
    if (error) {
      setPendingCollection(false);
      return setErrorMessage('Não foi possível instalar a coleção com as permissões atuais.');
    }
    const next = { ...runtime, ...Object.fromEntries(ids.map((id) => [id, true])) } as ExtensionRuntimeState;
    setRuntime(next);
    window.localStorage.setItem(extensionRuntimeStorageKey, JSON.stringify(next));
    setPendingCollection(false);
  }

  function updateMentionSettings(changes: Partial<typeof mentionSettings>) {
    const next = { ...mentionSettings, ...changes };
    setMentionSettings(next);
    window.localStorage.setItem(mentionExtensionStorageKey, JSON.stringify(next));
  }

  function actionLabel(id: ExtensionId) {
    const control = controlMap.get(id);
    if (runtime[id]) return 'Ativa';
    if (pendingId === id) return runtime[id] ? 'Desativando…' : 'Instalando…';
    if (!control?.acquired) return 'Adquirir acesso';
    if (!control.canInstall) return 'Indisponível';
    return 'Instalar';
  }

  return <div className="space-y-7">
    <section className="grid gap-2 rounded-card border border-line bg-surface p-3 sm:grid-cols-3" aria-label="Saúde das extensões">
      <div className="flex items-center gap-3 rounded-control px-3 py-2"><span className="size-2 rounded-full bg-success" /><div><p className="text-xs font-medium text-ink">Catálogo oficial</p><p className="text-[11px] text-muted">Autor Copilot Lab verificado</p></div></div>
      <div className="flex items-center gap-3 rounded-control px-3 py-2"><ShieldCheck className="size-4 text-success" /><div><p className="text-xs font-medium text-ink">Acesso protegido</p><p className="text-[11px] text-muted">Aquisição validada no servidor</p></div></div>
      <div className="flex items-center gap-3 rounded-control px-3 py-2"><Zap className="size-4 text-accent" /><div><p className="text-xs font-medium text-ink">{installedCount} módulos ativos</p><p className="text-[11px] text-muted">Somente itens autorizados</p></div></div>
    </section>

    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Autor Copilot Lab</p><h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Marketplace</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Extensões, plugins e conectores oficiais, auditados e incorporados ao produto. Abra os detalhes para experimentar cada recurso.</p></div><span className="inline-flex min-h-10 items-center gap-2 rounded-control border border-line bg-surface px-3 text-sm text-muted"><Download className="size-4 text-accent" />Meus instalados <strong className="text-ink">{installedCount}</strong></span></header>

    <section className="overflow-hidden rounded-card border border-accent/20 bg-accent-subtle p-6 sm:p-7"><div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent"><Sparkles className="size-3" />Coleção em destaque</span><h3 className="mt-4 font-serif text-2xl font-semibold text-ink">Kit de Escrita Consciente</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Contexto por @, Guardião de Referências e Métricas trabalham juntos para manter o cânone próximo da escrita sem interromper o fluxo.</p><div className="mt-4 flex flex-wrap gap-2">{['Contexto por @', 'Guardião de Referências', 'Métricas'].map((label) => <span key={label} className="rounded-full border border-accent/15 bg-surface/70 px-2.5 py-1 text-xs text-ink">{label}</span>)}</div></div><button type="button" disabled={pendingCollection} onClick={() => void installFeaturedCollection()} className="relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-control bg-accent px-4 text-sm font-medium text-on-accent transition-all hover:bg-accent-hover disabled:opacity-70">{pendingCollection ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4 animate-bounce" />}{pendingCollection ? 'Instalando coleção…' : 'Instalar coleção completa'}{pendingCollection && <span className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-white/50" />}</button></div></section>

    {errorMessage && <p role="alert" className="rounded-control border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-ink">{errorMessage}</p>}

    <nav className="grid grid-cols-3 gap-2 rounded-card border border-line bg-surface p-1.5" aria-label="Tipos do marketplace">
      {([['extension', 'Extensões', Blocks], ['plugin', 'Plugins', Puzzle], ['connector', 'Conectores', Cable]] as const).map(([value, label, Icon]) => {
        const count = catalog.filter((item) => item.productKind === value).length;
        return <button key={value} type="button" onClick={() => { setSection(value); setCategory('all'); }} className={cn('flex min-h-12 items-center justify-center gap-2 rounded-control px-3 text-sm font-medium transition-colors', section === value ? 'bg-accent text-on-accent shadow-sm' : 'text-muted hover:bg-surface-muted hover:text-ink')}><Icon className="size-4" /><span>{label}</span><span className={cn('rounded-full px-1.5 py-0.5 text-[10px]', section === value ? 'bg-white/15' : 'bg-surface-muted')}>{count}</span></button>;
      })}
    </nav>

    <section><label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><span className="sr-only">Buscar no marketplace</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, recurso ou tag" className="min-h-11 w-full rounded-control border border-line bg-surface pl-10 pr-14 text-sm text-ink outline-none placeholder:text-muted focus:border-accent" /><kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 py-0.5 text-[10px] text-muted">/</kbd></label><div className="workspace-scrollbar mt-3 flex gap-1 overflow-x-auto pb-1">{([['all', 'Todos'], ['editor', 'Editor'], ['narrative', 'Processo e narrativa'], ['styling', 'Aparência'], ['installed', `Instalados · ${installedCount}`]] as Array<[CategoryFilter, string]>).map(([value, label]) => <button key={value} type="button" onClick={() => setCategory(value)} className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium', category === value ? 'bg-accent text-on-accent' : 'bg-surface-muted text-muted hover:text-ink')}>{label}</button>)}</div></section>

    <section className="grid content-start gap-4 sm:grid-cols-2 2xl:grid-cols-3" aria-label="Catálogo de extensões">
      {filtered.map((extension) => {
        const Icon = extension.icon;
        const installed = runtime[extension.id];
        const control = controlMap.get(extension.id);
        return <article key={extension.id} className="group flex min-h-[19rem] flex-col overflow-hidden rounded-card border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg">
          <button type="button" onClick={() => openDetails(extension.id)} className="flex flex-1 flex-col p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"><div className="flex items-start gap-3"><span className="flex size-12 shrink-0 items-center justify-center rounded-card bg-accent-subtle text-accent"><Icon className="size-6" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-lg font-semibold text-ink">{extension.name}</h3><span className="rounded-full bg-success-subtle px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">Oficial</span></div><p className="mt-1 text-[11px] text-muted">{extension.author} · v{extension.version}</p></div></div><p className="mt-5 line-clamp-3 text-sm leading-relaxed text-muted">{extension.description}</p><div className="mt-auto flex flex-wrap gap-1.5 pt-5">{extension.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-muted">{tag}</span>)}</div></button>
          <div className="flex items-center gap-3 border-t border-line bg-surface-muted/45 px-5 py-4"><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-ink">{priceLabel(extension.priceModel, extension.priceCents, extension.currency)}</p><p className="mt-0.5 text-[10px] text-muted">{control?.acquired ? 'Disponível na sua conta' : 'Aquisição necessária'}</p></div><button type="button" disabled={!hydrated || pendingId === extension.id || !control?.canInstall} onClick={() => void setInstalled(extension.id, !installed)} className={cn('relative inline-flex min-h-9 items-center justify-center gap-1.5 overflow-hidden rounded-control px-3 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-55', installed ? 'border border-line bg-surface text-ink' : 'bg-accent text-on-accent hover:bg-accent-hover')}>{pendingId === extension.id ? <LoaderCircle className="size-3.5 animate-spin" /> : installed ? <Check className="size-3.5 animate-in zoom-in" /> : <Download className="size-3.5 transition-transform group-hover:translate-y-0.5" />}{actionLabel(extension.id)}{pendingId === extension.id && <span className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-current/35" />}</button><button type="button" onClick={() => openDetails(extension.id)} className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line bg-surface text-muted hover:border-accent hover:text-accent" aria-label={`Abrir detalhes de ${extension.name}`}><ChevronRight className="size-4" /></button></div>
        </article>;
      })}
      {!filtered.length && <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 text-center"><PackageOpen className="size-8 text-muted" /><h3 className="mt-4 font-serif text-lg font-semibold text-ink">Nenhum item nesta seção</h3><p className="mt-2 max-w-md text-sm text-muted">{section === 'plugin' ? 'Os primeiros plugins oficiais aparecerão aqui quando forem publicados.' : section === 'connector' ? 'Conectores de serviços externos serão publicados aqui após a integração.' : 'Ajuste os filtros ou a busca para encontrar outra extensão.'}</p></div>}
    </section>

    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} swipeDirection="right">
      <DrawerContent className="border-line bg-surface text-ink shadow-2xl data-[swipe-axis=x]:[--drawer-content-width:min(46rem,calc(100vw-1rem))]">
        <DrawerHeader className="border-b border-line px-5 pb-5 pt-5 text-left sm:px-7"><div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-card bg-accent-subtle text-accent">{(() => { const Icon = selected.icon; return <Icon className="size-6" />; })()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><DrawerTitle className="font-serif text-xl font-semibold text-ink sm:text-2xl">{selected.name}</DrawerTitle><span className="rounded-full bg-success-subtle px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">Oficial</span></div><DrawerDescription className="mt-1 text-sm leading-relaxed text-muted">{selected.description}</DrawerDescription><p className="mt-2 text-[11px] text-muted">{selected.author} · versão {selected.version} · {extensionCategoryLabels[selected.category]}</p></div><DrawerClose render={<button type="button" className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line text-muted hover:text-ink" aria-label="Fechar detalhes" />}><X className="size-4" /></DrawerClose></div></DrawerHeader>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <ManuscriptPreview extensionId={selected.id} />
          <MotionPreview mediaType={selected.mediaType} mediaUrl={selected.mediaUrl} title={selected.name} />
          <div className="mt-7 grid gap-6 md:grid-cols-[1fr_15rem]"><section><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">O que esta extensão faz</p><ul className="mt-3 space-y-3">{selected.features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-subtle text-success"><Check className="size-3" /></span>{feature}</li>)}</ul></section><aside className="rounded-card border border-line bg-surface-muted p-4"><p className="text-xs font-semibold text-ink">Resumo técnico</p><dl className="mt-4 space-y-3 text-xs"><div className="flex items-center justify-between gap-3"><dt className="text-muted">Desempenho</dt><dd className="font-medium text-ink">&lt; {selected.performanceBudgetMs} ms</dd></div><div className="flex items-center justify-between gap-3"><dt className="text-muted">Processamento</dt><dd className="font-medium text-ink">Local</dd></div><div className="flex items-center justify-between gap-3"><dt className="text-muted">Dependência</dt><dd className="font-medium text-success">Compatível</dd></div></dl></aside></div>
          <section className="mt-7 border-t border-line pt-6"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" /><h3 className="text-sm font-semibold text-ink">Privacidade e permissões</h3></div><p className="mt-2 text-xs leading-relaxed text-muted">O código desta extensão faz parte do Autor Copilot e executa dentro do editor. Nenhum manuscrito é enviado a terceiros por este módulo.</p><div className="mt-3 flex flex-wrap gap-2">{selected.permissions.map((permission) => <span key={permission} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink"><LockKeyhole className="size-3 text-muted" />{permission}</span>)}</div></section>
          {selected.id === 'lab.context-mentions' && runtime[selected.id] && <section className="mt-7 border-t border-line pt-6"><div className="flex items-center gap-2"><Settings2 className="size-4 text-accent" /><h3 className="text-sm font-semibold text-ink">Configuração rápida</h3></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => updateMentionSettings({ appearance: 'highlighted' })} className={cn('rounded-control border px-3 py-2 text-xs', mentionSettings.appearance === 'highlighted' ? 'border-accent bg-accent-subtle text-accent' : 'border-line text-muted')}>Destacado</button><button type="button" onClick={() => updateMentionSettings({ appearance: 'plain' })} className={cn('rounded-control border px-3 py-2 text-xs', mentionSettings.appearance === 'plain' ? 'border-accent bg-accent-subtle text-accent' : 'border-line text-muted')}>Texto comum</button></div><label className="mt-4 flex items-center justify-between gap-3 rounded-control bg-surface-muted px-3 py-2.5 text-xs text-muted"><span>Verificar vínculos quebrados</span><input type="checkbox" checked={mentionSettings.verifyReferences} onChange={(event) => updateMentionSettings({ verifyReferences: event.target.checked })} /></label><label className="mt-2 flex items-center justify-between gap-3 rounded-control bg-surface-muted px-3 py-2.5 text-xs text-muted"><span>Mostrar contagens e metadados</span><input type="checkbox" checked={mentionSettings.showCounts && mentionSettings.showMetadata} onChange={(event) => updateMentionSettings({ showCounts: event.target.checked, showMetadata: event.target.checked })} /></label></section>}
          <section className="mt-7 rounded-card border border-line bg-surface-muted p-4"><div className="flex items-center gap-3"><Gauge className="size-5 text-accent" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{selectedControl?.acquired ? 'Licença disponível' : 'Aquisição necessária'}</p><p className="mt-0.5 text-xs text-muted">{selectedControl?.acquired ? 'Esta extensão pode ser instalada e usada nesta conta.' : 'A ativação permanece bloqueada até que uma licença seja vinculada à sua conta.'}</p></div><strong className="text-sm text-ink">{priceLabel(selected.priceModel, selected.priceCents, selected.currency)}</strong></div></section>
          {errorMessage && <p role="alert" className="mt-4 rounded-control border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-ink">{errorMessage}</p>}
        </div>

        <DrawerFooter className="border-t border-line px-5 pb-5 pt-4 sm:flex-row sm:items-center sm:px-7"><button type="button" disabled={!hydrated || pendingId === selected.id || !selectedControl?.canInstall} onClick={() => void setInstalled(selected.id, !runtime[selected.id])} className={cn('relative inline-flex min-h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-control px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-55', runtime[selected.id] ? 'border border-line bg-surface text-ink' : 'bg-accent text-on-accent hover:bg-accent-hover')}>{pendingId === selected.id ? <LoaderCircle className="size-4 animate-spin" /> : runtime[selected.id] ? <Check className="size-4 animate-in zoom-in" /> : <Download className="size-4 animate-bounce" />}{actionLabel(selected.id)}{pendingId === selected.id && <span className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-current/35" />}</button><DrawerClose render={<button type="button" className="inline-flex min-h-11 items-center justify-center rounded-control border border-line px-4 text-sm font-medium text-ink hover:bg-surface-muted" />}>Fechar</DrawerClose></DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>;
}
