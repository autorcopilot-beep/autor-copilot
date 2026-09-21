'use client';

import {
  BookOpenText,
  Building2,
  CalendarRange,
  Compass,
  Gem,
  Lightbulb,
  Plus,
  Search,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  encyclopediaTypeLabels,
  type EncyclopediaEntry,
  type EncyclopediaEntryType,
} from '@/features/writing/types';
import { cn } from '@/lib/cn';

const entryTypes: EncyclopediaEntryType[] = ['character', 'location', 'organization', 'object', 'concept', 'event'];

const typeIcons = {
  character: UserRound,
  location: Compass,
  organization: Building2,
  object: Gem,
  concept: Lightbulb,
  event: CalendarRange,
} satisfies Record<EncyclopediaEntryType, typeof UserRound>;

export type EncyclopediaEntryDraft = Pick<EncyclopediaEntry, 'type' | 'name' | 'aliases' | 'summary' | 'details' | 'color'>;

const emptyDraft: EncyclopediaEntryDraft = {
  type: 'character',
  name: '',
  aliases: [],
  summary: '',
  details: '',
  color: 'violet',
};

export function EncyclopediaView({
  entries,
  onSave,
  onDelete,
}: {
  entries: EncyclopediaEntry[];
  onSave: (draft: EncyclopediaEntryDraft, entryId?: string) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<EncyclopediaEntryType | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EncyclopediaEntryDraft>(emptyDraft);
  const [aliasesText, setAliasesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const visibleEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return entries.filter((entry) => {
      if (filter !== 'all' && entry.type !== filter) return false;
      if (!normalized) return true;
      return [entry.name, entry.summary, ...entry.aliases]
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalized));
    });
  }, [entries, filter, query]);

  function startCreating(type: EncyclopediaEntryType = 'character') {
    setEditingId(null);
    setDraft({ ...emptyDraft, type });
    setAliasesText('');
    setError('');
  }

  function startEditing(entry: EncyclopediaEntry) {
    setEditingId(entry.id);
    setDraft({
      type: entry.type,
      name: entry.name,
      aliases: entry.aliases,
      summary: entry.summary,
      details: entry.details,
      color: entry.color,
    });
    setAliasesText(entry.aliases.join(', '));
    setError('');
  }

  async function submit() {
    if (!draft.name.trim()) {
      setError('Dê um nome à entrada para salvá-la.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        ...draft,
        name: draft.name.trim(),
        aliases: aliasesText.split(',').map((value) => value.trim()).filter(Boolean).slice(0, 20),
      }, editingId ?? undefined);
      setDraft(emptyDraft);
      setAliasesText('');
      setEditingId(null);
    } catch {
      setError('Não foi possível salvar esta entrada agora.');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editingId || !window.confirm(`Apagar “${draft.name}” da Enciclopédia? As menções existentes continuarão visíveis no texto.`)) return;
    setSaving(true);
    try {
      await onDelete(editingId);
      startCreating();
    } catch {
      setError('Não foi possível apagar esta entrada agora.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
      <header className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Mundo da obra</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">Enciclopédia</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Organize personagens, lugares e elementos do universo. No editor, digite <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-sans text-xs text-ink">@</kbd> para vinculá-los ao texto.</p>
        </div>
        <button type="button" onClick={() => startCreating()} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"><Plus className="size-4" />Nova entrada</button>
      </header>

      <div className="mt-6 grid min-h-[34rem] overflow-hidden rounded-card border border-line bg-surface lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0 border-b border-line lg:border-b-0 lg:border-r" aria-label="Entradas da Enciclopédia">
          <div className="border-b border-line p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <span className="sr-only">Buscar na Enciclopédia</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome, apelido ou descrição" className="min-h-10 w-full rounded-control border border-line bg-editor pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent" />
            </label>
            <div className="workspace-scrollbar mt-3 flex gap-1 overflow-x-auto pb-1" aria-label="Filtrar por tipo">
              <button type="button" onClick={() => setFilter('all')} className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium', filter === 'all' ? 'bg-accent text-on-accent' : 'bg-surface-muted text-muted hover:text-ink')}>Todos · {entries.length}</button>
              {entryTypes.map((type) => <button key={type} type="button" onClick={() => setFilter(type)} className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium', filter === type ? 'bg-accent text-on-accent' : 'bg-surface-muted text-muted hover:text-ink')}>{encyclopediaTypeLabels[type]}</button>)}
            </div>
          </div>

          {visibleEntries.length ? (
            <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
              {visibleEntries.map((entry) => {
                const Icon = typeIcons[entry.type];
                return <button key={entry.id} type="button" onClick={() => startEditing(entry)} className={cn('min-h-40 bg-editor p-5 text-left transition-colors hover:bg-accent-subtle', editingId === entry.id && 'bg-accent-subtle')}>
                  <span className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-accent"><Icon className="size-4" /></span>
                  <span className="mt-4 block truncate font-serif text-lg font-semibold text-ink">{entry.name}</span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-accent">{encyclopediaTypeLabels[entry.type]}</span>
                  <span className="mt-3 block line-clamp-2 text-xs leading-relaxed text-muted">{entry.summary || 'Sem resumo. Abra para desenvolver esta entrada.'}</span>
                </button>;
              })}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <BookOpenText className="size-8 text-accent" />
              <h2 className="mt-4 font-serif text-xl font-semibold text-ink">{entries.length ? 'Nenhuma entrada encontrada' : 'Comece a construir este universo'}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{entries.length ? 'Ajuste a busca ou escolha outra categoria.' : 'Crie o primeiro personagem, lugar ou conceito. Ele ficará disponível imediatamente no menu de @ do editor.'}</p>
            </div>
          )}
        </section>

        <aside className="bg-surface p-5" aria-label={editingId ? 'Editar entrada' : 'Nova entrada'}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">{editingId ? 'Editar entrada' : 'Nova entrada'}</p>
          <h2 className="mt-1 font-serif text-xl font-semibold text-ink">{editingId ? draft.name : 'Registrar no universo'}</h2>
          <div className="mt-5 space-y-4">
            <div><label htmlFor="encyclopedia-type" className="text-xs font-medium text-muted">Tipo</label><select id="encyclopedia-type" value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as EncyclopediaEntryType }))} className="mt-1.5 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink">{entryTypes.map((type) => <option key={type} value={type}>{encyclopediaTypeLabels[type]}</option>)}</select></div>
            <div><label htmlFor="encyclopedia-name" className="text-xs font-medium text-muted">Nome</label><input id="encyclopedia-name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} maxLength={120} placeholder="Ex.: Amélia Vilar" className="mt-1.5 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent" /></div>
            <div><label htmlFor="encyclopedia-aliases" className="text-xs font-medium text-muted">Apelidos e aliases</label><input id="encyclopedia-aliases" value={aliasesText} onChange={(event) => setAliasesText(event.target.value)} placeholder="Separe por vírgulas" className="mt-1.5 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent" /></div>
            <div><label htmlFor="encyclopedia-summary" className="text-xs font-medium text-muted">Resumo contextual</label><textarea id="encyclopedia-summary" value={draft.summary} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} maxLength={1000} rows={4} placeholder="O essencial para lembrar enquanto escreve." className="mt-1.5 w-full resize-none rounded-control border border-line bg-editor px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent" /></div>
            <div><label htmlFor="encyclopedia-details" className="text-xs font-medium text-muted">Notas completas</label><textarea id="encyclopedia-details" value={draft.details} onChange={(event) => setDraft((current) => ({ ...current, details: event.target.value }))} maxLength={30000} rows={6} placeholder="História, aparência, motivações, relações e detalhes de continuidade." className="mt-1.5 w-full resize-none rounded-control border border-line bg-editor px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent" /></div>
          </div>
          {error && <p className="mt-3 text-xs text-danger" role="alert">{error}</p>}
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={() => void submit()} disabled={saving} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-control bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-60">{saving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Criar entrada'}</button>
            {editingId && <button type="button" onClick={() => void remove()} disabled={saving} className="flex size-10 shrink-0 items-center justify-center rounded-control border border-line text-danger hover:bg-danger-subtle" aria-label="Apagar entrada" title="Apagar entrada"><Trash2 className="size-4" /></button>}
          </div>
        </aside>
      </div>
    </div>
  );
}
