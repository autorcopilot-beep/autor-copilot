'use client';

import {
  ArrowDownAZ, BookOpenText, Building2, CalendarRange, Check, Compass, Gem,
  Lightbulb, List, LayoutGrid, Menu, Plus, Search, ShieldCheck, Sparkles, Star, X,
  Trash2, UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui';

import {
  encyclopediaTypeLabels,
  type EncyclopediaEntry,
  type EncyclopediaEntryType,
  type EncyclopediaStatus,
} from '@/features/writing/types';
import { cn } from '@/lib/cn';

const entryTypes: EncyclopediaEntryType[] = ['character', 'location', 'organization', 'object', 'concept', 'event'];
const typeIcons = {
  character: UserRound, location: Compass, organization: Building2,
  object: Gem, concept: Lightbulb, event: CalendarRange,
} satisfies Record<EncyclopediaEntryType, typeof UserRound>;
const statusLabels: Record<EncyclopediaStatus, string> = {
  draft: 'Em construção', canon: 'Cânone', archived: 'Arquivada',
};
const colorOptions = [
  { value: 'violet', label: 'Violeta', style: 'bg-violet-500' },
  { value: 'blue', label: 'Azul', style: 'bg-blue-500' },
  { value: 'green', label: 'Verde', style: 'bg-emerald-600' },
  { value: 'amber', label: 'Âmbar', style: 'bg-amber-500' },
  { value: 'rose', label: 'Rosa', style: 'bg-rose-500' },
  { value: 'slate', label: 'Ardósia', style: 'bg-slate-500' },
];
const colorHex: Record<string, string> = { violet: '#8b5cf6', blue: '#3b82f6', green: '#059669', amber: '#f59e0b', rose: '#f43f5e', slate: '#64748b' };
function updatedLabel(value: string) {
  return Number.isFinite(Date.parse(value))
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value))
    : 'recentemente';
}
const fieldHints: Record<EncyclopediaEntryType, { role: string; appearance: string; history: string; connections: string; rules: string }> = {
  character: { role: 'Papel na narrativa', appearance: 'Aparência e marcas', history: 'Passado e transformação', connections: 'Relações e conflitos', rules: 'Motivações e limites' },
  location: { role: 'Função na história', appearance: 'Atmosfera e geografia', history: 'História do lugar', connections: 'Habitantes e vínculos', rules: 'Regras do espaço' },
  organization: { role: 'Propósito no enredo', appearance: 'Símbolos e presença', history: 'Origem e trajetória', connections: 'Alianças e rivalidades', rules: 'Estrutura e normas' },
  object: { role: 'Importância no enredo', appearance: 'Forma e materiais', history: 'Origem e percurso', connections: 'Portadores e vínculos', rules: 'Uso e limitações' },
  concept: { role: 'Impacto no mundo', appearance: 'Como se manifesta', history: 'Origem da ideia', connections: 'Quem é afetado', rules: 'Princípios e exceções' },
  event: { role: 'Consequência narrativa', appearance: 'Cenário e sinais', history: 'Causas e desdobramentos', connections: 'Envolvidos', rules: 'Cronologia e condições' },
};
type Question = { id: string; label: string; kind: 'text' | 'list' | 'check' | 'select'; options?: string[]; hint?: string };
const questions: Record<EncyclopediaEntryType, Question[]> = {
  character: [
    { id: 'arc', label: 'Qual arco atravessa?', kind: 'select', options: ['A descobrir', 'Transformação', 'Queda', 'Redenção', 'Estabilidade'] },
    { id: 'desires', label: 'O que deseja?', kind: 'list', hint: 'Adicione desejos e necessidades, um por vez.' },
    { id: 'fears', label: 'O que teme?', kind: 'list' },
    { id: 'secret', label: 'Guarda um segredo importante?', kind: 'check' },
    { id: 'voice', label: 'Como fala ou pensa?', kind: 'text' },
  ],
  location: [
    { id: 'climate', label: 'Qual é o clima predominante?', kind: 'select', options: ['A definir', 'Árido', 'Temperado', 'Úmido', 'Frio', 'Variável'] },
    { id: 'sensations', label: 'O que se percebe ao chegar?', kind: 'list', hint: 'Sons, cheiros, texturas e outros sentidos.' },
    { id: 'access', label: 'Como se entra ou sai?', kind: 'text' },
    { id: 'restricted', label: 'Existe uma área proibida?', kind: 'check' },
  ],
  organization: [
    { id: 'scope', label: 'Qual o alcance?', kind: 'select', options: ['A definir', 'Local', 'Regional', 'Global', 'Secreto'] },
    { id: 'members', label: 'Quem participa?', kind: 'list' },
    { id: 'methods', label: 'Como atua?', kind: 'list' },
    { id: 'public', label: 'É conhecida publicamente?', kind: 'check' },
  ],
  object: [
    { id: 'owners', label: 'Quem já teve este objeto?', kind: 'list' },
    { id: 'abilities', label: 'O que pode fazer?', kind: 'list' },
    { id: 'cost', label: 'Qual é o custo ou risco do uso?', kind: 'text' },
    { id: 'unique', label: 'É único neste mundo?', kind: 'check' },
  ],
  concept: [
    { id: 'domains', label: 'Onde se aplica?', kind: 'list' },
    { id: 'exceptions', label: 'Quais são as exceções?', kind: 'list' },
    { id: 'belief', label: 'É aceito por todos?', kind: 'check' },
    { id: 'origin', label: 'Quem o formulou ou descobriu?', kind: 'text' },
  ],
  event: [
    { id: 'period', label: 'Quando acontece?', kind: 'text' },
    { id: 'participants', label: 'Quem estava presente?', kind: 'list' },
    { id: 'consequences', label: 'O que mudou depois?', kind: 'list' },
    { id: 'witnessed', label: 'Foi testemunhado diretamente?', kind: 'check' },
  ],
};

export type EncyclopediaEntryDraft = Pick<EncyclopediaEntry,
  'type' | 'name' | 'aliases' | 'summary' | 'details' | 'color' | 'status' | 'tags' |
  'storyRole' | 'appearance' | 'history' | 'connections' | 'rules' | 'isPinned' | 'isSpoiler' | 'profileAnswers'>;

function emptyDraft(type: EncyclopediaEntryType = 'character'): EncyclopediaEntryDraft {
  return {
    type, name: '', aliases: [], summary: '', details: '', color: 'violet',
    status: 'draft', tags: [], storyRole: '', appearance: '', history: '',
    connections: '', rules: '', isPinned: false, isSpoiler: false, profileAnswers: {},
  };
}

const examples: Array<{ type: EncyclopediaEntryType; title: string; description: string; draft: EncyclopediaEntryDraft }> = [
  {
    type: 'character', title: 'Uma protagonista com contradições',
    description: 'Identidade, desejo, obstáculo e relações em uma ficha que ajuda a manter a voz consistente.',
    draft: { ...emptyDraft('character'), name: 'Lia Avelar', aliases: ['Lia'], summary: 'Cartógrafa que precisa voltar à cidade que jurou deixar.', storyRole: 'Protagonista; deseja encontrar o irmão desaparecido.', appearance: 'Carrega um mapa dobrado no bolso do casaco.', history: 'Partiu após um incêndio e evita falar sobre aquela noite.', connections: 'Irmã de Tomás; antiga aprendiz de Mara.', rules: 'Conhece as rotas antigas, mas teme espaços fechados.', tags: ['protagonista', 'núcleo central'], profileAnswers: { 'character.arc': 'Transformação', 'character.desires': ['Encontrar Tomás', 'Entender o incêndio'], 'character.secret': true } },
  },
  {
    type: 'location', title: 'Um lugar que interfere na trama',
    description: 'Geografia, atmosfera e limites do cenário para orientar descrições e continuidade.',
    draft: { ...emptyDraft('location'), name: 'Estação das Marés', summary: 'Terminal abandonado que só pode ser alcançado na maré baixa.', storyRole: 'Ponto de encontro e passagem para o segundo ato.', appearance: 'Azulejos verdes, sal nas janelas e relógios parados.', history: 'Foi fechada depois da grande inundação.', connections: 'Lia guarda ali uma carta; Mara conhece a entrada secundária.', rules: 'A passagem fica submersa duas vezes ao dia.', tags: ['cenário', 'mistério'], profileAnswers: { 'location.sensations': ['Cheiro de sal', 'Metal úmido'], 'location.restricted': true } },
  },
  {
    type: 'object', title: 'Um objeto com regras claras',
    description: 'Origem, posse e restrições que impedem contradições em cenas futuras.',
    draft: { ...emptyDraft('object'), name: 'Bússola de vidro', summary: 'Instrumento que aponta para uma lembrança, nunca para o norte.', storyRole: 'Pista para localizar a estação.', appearance: 'Vidro fosco com um fio vermelho preso à agulha.', history: 'Pertenceu ao avô de Lia.', connections: 'Lia a herdou; Mara conhece sua origem.', rules: 'Funciona apenas quando alguém descreve em voz alta uma memória verdadeira.', tags: ['artefato', 'pista'], profileAnswers: { 'object.owners': ['Avô de Lia', 'Lia'], 'object.unique': true } },
  },
];

function TextField({ label, value, onChange, maxLength, placeholder, rows = 0 }: {
  label: string; value: string; onChange: (value: string) => void;
  maxLength: number; placeholder?: string; rows?: number;
}) {
  const base = 'mt-1.5 w-full rounded-xl border border-line bg-editor px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-accent';
  return <label className="block"><span className="text-xs font-semibold text-ink">{label}</span>
    {rows ? <textarea value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} rows={rows} placeholder={placeholder} className={cn(base, 'resize-y leading-relaxed')} />
      : <input value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} placeholder={placeholder} className={base} />}
  </label>;
}

function ListQuestion({ question, values, onChange }: { question: Question; values: string[]; onChange: (values: string[]) => void }) {
  const [item, setItem] = useState('');
  function addItem() {
    const next = item.trim();
    if (next && values.length < 12 && !values.includes(next)) onChange([...values, next]);
    setItem('');
  }
  return <div><p className="text-xs font-semibold text-ink">{question.label}</p>{question.hint && <p className="mt-1 text-[11px] text-muted">{question.hint}</p>}
    <div className="mt-2 flex flex-wrap gap-1.5">{values.map((value) => <span key={value} className="inline-flex items-center gap-1 rounded-full border border-line bg-editor py-1 pl-2.5 pr-1 text-xs text-ink">{value}<button type="button" onClick={() => onChange(values.filter((item) => item !== value))} aria-label={`Remover ${value}`} className="rounded-full p-1 hover:bg-surface-muted"><X className="size-3" /></button></span>)}</div>
    <div className="mt-2 flex gap-2"><input value={item} onChange={(event) => setItem(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addItem(); } }} maxLength={100} placeholder="Adicionar item" className="min-h-10 min-w-0 flex-1 rounded-xl border border-line bg-editor px-3 text-sm text-ink outline-none focus:border-accent" /><button type="button" onClick={addItem} disabled={!item.trim() || values.length >= 12} className="rounded-xl border border-line px-3 text-xs font-semibold text-accent disabled:opacity-40">Adicionar</button></div>
  </div>;
}

export function EncyclopediaView({
  entries, workTitle, persistence, onSave, onDelete,
}: {
  entries: EncyclopediaEntry[];
  workTitle: string;
  persistence: 'cloud' | 'local';
  onSave: (draft: EncyclopediaEntryDraft, entryId?: string) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
}) {
  const [section, setSection] = useState<'library' | 'guide'>('library');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<EncyclopediaEntryType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EncyclopediaStatus | 'all'>('all');
  const [sort, setSort] = useState<'name' | 'recent'>('name');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EncyclopediaEntryDraft>(() => emptyDraft());
  const [aliasesText, setAliasesText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const counts = useMemo(() => ({
    canon: entries.filter((entry) => entry.status === 'canon').length,
    pinned: entries.filter((entry) => entry.isPinned).length,
    types: Object.fromEntries(entryTypes.map((type) => [type, entries.filter((entry) => entry.type === type).length])),
  }), [entries]);
  const visibleEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return entries.filter((entry) => {
      if (filter !== 'all' && entry.type !== filter) return false;
      if (statusFilter !== 'all' && entry.status !== statusFilter) return false;
      return !normalized || [entry.name, entry.summary, entry.storyRole, ...entry.aliases, ...entry.tags]
        .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalized));
    }).sort((a, b) => (Number(b.isPinned) - Number(a.isPinned)) ||
      (sort === 'recent' ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt) : a.name.localeCompare(b.name, 'pt-BR')));
  }, [entries, filter, query, sort, statusFilter]);

  function startCreating(type: EncyclopediaEntryType = 'character') {
    setEditingId(null); setDraft(emptyDraft(type)); setAliasesText(''); setTagsText('');
    setError(''); setNotice(''); setSection('library');
    setDrawerOpen(true);
  }
  function startEditing(entry: EncyclopediaEntry) {
    setEditingId(entry.id);
    setDraft({
      type: entry.type, name: entry.name, aliases: entry.aliases, summary: entry.summary,
      details: entry.details, color: entry.color, status: entry.status ?? 'draft',
      tags: entry.tags ?? [], storyRole: entry.storyRole ?? '', appearance: entry.appearance ?? '',
      history: entry.history ?? '', connections: entry.connections ?? '', rules: entry.rules ?? '',
      isPinned: entry.isPinned ?? false, isSpoiler: entry.isSpoiler ?? false,
      profileAnswers: entry.profileAnswers ?? {},
    });
    setAliasesText(entry.aliases.join(', ')); setTagsText((entry.tags ?? []).join(', '));
    setError(''); setNotice(''); setSection('library');
    setDrawerOpen(true);
  }
  function applyExample(example: (typeof examples)[number]) {
    setEditingId(null); setDraft({ ...example.draft });
    setAliasesText(example.draft.aliases.join(', ')); setTagsText(example.draft.tags.join(', '));
    setSection('library'); setError(''); setNotice('Modelo carregado. Personalize a ficha e salve quando quiser.');
    setDrawerOpen(true);
  }
  async function submit() {
    if (!draft.name.trim()) { setError('Dê um nome à ficha antes de salvar.'); return; }
    setSaving(true); setError(''); setNotice('');
    try {
      await onSave({
        ...draft, name: draft.name.trim(),
        profileAnswers: Object.fromEntries(Object.entries(draft.profileAnswers).filter(([key]) => key.startsWith(`${draft.type}.`))),
        aliases: aliasesText.split(',').map((value) => value.trim()).filter(Boolean).slice(0, 20),
        tags: [...new Set(tagsText.split(',').map((value) => value.trim().slice(0, 40)).filter(Boolean))].slice(0, 12),
      }, editingId ?? undefined);
      setDrawerOpen(false);
      setEditingId(null);
      setDraft(emptyDraft(draft.type));
      setNotice('Ficha salva na Enciclopédia.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar a ficha agora.');
    } finally { setSaving(false); }
  }
  async function remove() {
    if (!editingId || !window.confirm(`Apagar “${draft.name}” da Enciclopédia? As menções existentes continuarão visíveis no texto.`)) return;
    setSaving(true); setError('');
    try { await onDelete(editingId); setDrawerOpen(false); setEditingId(null); setDraft(emptyDraft()); setNotice('Ficha removida.'); }
    catch { setError('Não foi possível apagar a ficha agora.'); }
    finally { setSaving(false); }
  }
  const hints = fieldHints[draft.type];

  return <div className="mx-auto w-full max-w-[94rem] px-4 pb-16 pt-24 sm:px-8 lg:px-12">
    <header className="creative-page-hero px-6 py-7 sm:px-9 sm:py-9">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-accent">Atlas · {workTitle}</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink sm:text-5xl">Enciclopédia</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">A memória viva da sua obra. Organize o mundo, mantenha detalhes coerentes e cite qualquer ficha no manuscrito com <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-xs text-ink">@</kbd>.</p>
        </div>
        <button type="button" onClick={() => startCreating()} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover"><Plus className="size-4" />Criar ficha</button>
      </div>
    </header>

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="creative-stat"><BookOpenText className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{entries.length}</p><p className="text-xs text-muted">fichas neste universo</p></div>
      <div className="creative-stat"><ShieldCheck className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{counts.canon}</p><p className="text-xs text-muted">marcadas como cânone</p></div>
      <div className="creative-stat"><Star className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{counts.pinned}</p><p className="text-xs text-muted">em destaque</p></div>
    </div>

    <nav className="creative-page-tabs mt-6" aria-label="Seções da Enciclopédia">
      <button type="button" onClick={() => setSection('library')} aria-current={section === 'library' ? 'page' : undefined} className={cn('creative-page-tab', section === 'library' && 'creative-page-tab-active')}>Acervo</button>
      <button type="button" onClick={() => setSection('guide')} aria-current={section === 'guide' ? 'page' : undefined} className={cn('creative-page-tab', section === 'guide' && 'creative-page-tab-active')}>Guia e exemplos</button>
    </nav>
    {notice && !drawerOpen && <p className="mt-4 rounded-xl border border-success/20 bg-success-subtle px-4 py-3 text-xs text-success" role="status">{notice}</p>}

    {section === 'guide' ? <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-accent">Guia oficial</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Um universo que se mantém coerente</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Uma boa ficha responde o que é essencial durante a escrita. Comece pelo resumo e pelo papel na história; acrescente regras, vínculos e detalhes à medida que a obra cresce. Os exemplos abaixo são modelos editáveis: nenhum dado é criado antes de você salvar.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{examples.map((example) => {
          const Icon = typeIcons[example.type];
          return <article key={example.title} className="flex flex-col rounded-2xl border border-line bg-editor p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent"><Icon className="size-5" /></span>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-accent">{encyclopediaTypeLabels[example.type]}</p>
            <h3 className="mt-1 font-serif text-xl font-semibold text-ink">{example.title}</h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{example.description}</p>
            <button type="button" onClick={() => applyExample(example)} className="mt-5 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold text-accent hover:border-accent">Usar este modelo</button>
          </article>;
        })}</div>
      </section>
      <aside className="self-start rounded-2xl border border-line bg-surface p-6">
        <Sparkles className="size-5 text-accent" /><h3 className="mt-3 font-serif text-xl font-semibold text-ink">Como usar no editor</h3>
        <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          <li><span className="font-semibold text-ink">01 · Crie uma ficha.</span><br />Nome e tipo bastam para começar.</li>
          <li><span className="font-semibold text-ink">02 · Digite @ no texto.</span><br />Escolha a entidade sugerida para criar uma referência vinculada.</li>
          <li><span className="font-semibold text-ink">03 · Revise o contexto.</span><br />O inspetor do capítulo mostra citações e vínculos quebrados.</li>
        </ol>
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">Etiquetas organizam o acervo; “cânone” indica o que já está estabelecido. O aviso de spoiler ajuda você a identificar revelações durante a consulta.</p>
      </aside>
    </div> : <div className="mt-5 grid items-start gap-4 xl:grid-cols-[13rem_minmax(0,1fr)]">
      <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="encyclopedia-filters" className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink xl:hidden"><Menu className="size-4 text-accent" />Categorias e filtros</button>
      <aside id="encyclopedia-filters" className={cn('rounded-2xl border border-line bg-surface p-4 xl:block', !filtersOpen && 'hidden')} aria-label="Categorias">
        <p className="px-2 text-[10px] font-bold uppercase tracking-[.16em] text-accent">Explorar</p>
        <button type="button" onClick={() => setFilter('all')} className={cn('mt-3 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm', filter === 'all' ? 'bg-accent-subtle font-semibold text-accent' : 'text-muted hover:bg-editor')}>Todas <span>{entries.length}</span></button>
        {entryTypes.map((type) => { const Icon = typeIcons[type]; return <button key={type} type="button" onClick={() => setFilter(type)} className={cn('mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm', filter === type ? 'bg-accent-subtle font-semibold text-accent' : 'text-muted hover:bg-editor hover:text-ink')}><Icon className="size-4" /><span className="flex-1">{encyclopediaTypeLabels[type]}</span><span className="text-xs">{counts.types[type]}</span></button>; })}
        <div className="mt-5 border-t border-line px-2 pt-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Situação</p>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as EncyclopediaStatus | 'all')} aria-label="Filtrar por situação" className="mt-3 w-full rounded-xl border border-line bg-editor p-2 text-xs text-ink"><option value="all">Todas as situações</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </div>
      </aside>

      <section className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-5" aria-label="Fichas da Enciclopédia">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><span className="sr-only">Buscar fichas</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome, etiqueta, papel ou resumo" className="min-h-11 w-full rounded-full border border-line bg-editor pl-10 pr-4 text-sm text-ink outline-none focus:border-accent" /></label>
          <div className="flex gap-2"><button type="button" onClick={() => setSort(sort === 'name' ? 'recent' : 'name')} title={sort === 'name' ? 'Ordenar por atualização' : 'Ordenar por nome'} className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-editor px-3 text-xs text-ink"><ArrowDownAZ className="size-4" />{sort === 'name' ? 'Nome' : 'Recentes'}</button><button type="button" onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')} title="Alternar visualização" aria-label={layout === 'grid' ? 'Mostrar lista' : 'Mostrar grade'} className="flex size-11 items-center justify-center rounded-full border border-line bg-editor text-ink">{layout === 'grid' ? <List className="size-4" /> : <LayoutGrid className="size-4" />}</button></div>
        </div>
        <p className="mt-4 text-xs text-muted">{visibleEntries.length} {visibleEntries.length === 1 ? 'ficha encontrada' : 'fichas encontradas'}</p>
        {visibleEntries.length ? <div className={cn('mt-3 grid gap-3', layout === 'grid' && 'sm:grid-cols-2 2xl:grid-cols-3')}>{visibleEntries.map((entry) => {
          const Icon = typeIcons[entry.type];
          return <button key={entry.id} type="button" onClick={() => startEditing(entry)} aria-pressed={editingId === entry.id} style={{ borderLeftColor: colorHex[entry.color] ?? colorHex.violet }} className={cn('rounded-xl border border-line border-l-4 bg-editor p-4 text-left transition-colors hover:border-accent', editingId === entry.id && 'border-accent bg-accent-subtle')}>
            <span className="flex items-start justify-between gap-2"><span className="flex size-9 items-center justify-center rounded-lg bg-surface text-accent"><Icon className="size-4" /></span><span className="flex gap-1">{entry.isPinned && <Star className="size-4 fill-accent text-accent" aria-label="Em destaque" />}{entry.isSpoiler && <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] text-muted">Spoiler</span>}</span></span>
            <span className="mt-3 block truncate font-serif text-lg font-semibold text-ink">{entry.name}</span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-accent">{encyclopediaTypeLabels[entry.type]} · {statusLabels[entry.status ?? 'draft']}</span>
            <span className="mt-3 block line-clamp-2 min-h-9 text-xs leading-relaxed text-muted">{entry.summary || entry.storyRole || 'Ficha em construção. Abra para acrescentar contexto.'}</span>
            <span className="mt-3 block border-t border-line pt-2 text-[10px] text-muted">{Object.keys(entry.profileAnswers ?? {}).length} respostas · Atualizada {updatedLabel(entry.updatedAt)}</span>
            {!!entry.tags?.length && <span className="mt-3 flex flex-wrap gap-1">{entry.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">{tag}</span>)}</span>}
          </button>;
        })}</div> : <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center"><BookOpenText className="size-8 text-accent" /><h2 className="mt-4 font-serif text-xl font-semibold text-ink">{entries.length ? 'Nada com esses filtros' : 'Seu universo começa aqui'}</h2><p className="mt-2 max-w-sm text-sm text-muted">{entries.length ? 'Tente outra busca ou situação editorial.' : 'Crie uma ficha ou abra o guia para usar um modelo oficial.'}</p>{!entries.length && <button type="button" onClick={() => setSection('guide')} className="mt-4 text-sm font-semibold text-accent hover:underline">Explorar exemplos</button>}</div>}
      </section>

    </div>}
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} swipeDirection="right">
      <DrawerContent className="bg-surface" style={{ '--drawer-content-width': 'min(100vw, 44rem)' } as React.CSSProperties}>
        <DrawerDescription className="sr-only">Crie ou edite uma ficha editorial da Enciclopédia.</DrawerDescription>
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7"><DrawerTitle className="font-serif text-xl font-semibold text-ink">{editingId ? 'Editar ficha' : 'Criar ficha'}</DrawerTitle><DrawerClose aria-label="Fechar formulário" className="rounded-full p-2 text-muted hover:bg-editor hover:text-ink"><X className="size-5" /></DrawerClose></div>
      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">{editingId ? 'Editar ficha' : 'Nova ficha'}</p><h2 className="mt-1 font-serif text-2xl font-semibold text-ink">{editingId ? draft.name || 'Sem nome' : 'Registrar no universo'}</h2></div><span className="rounded-full bg-accent-subtle px-2 py-1 text-[10px] font-semibold text-accent">{persistence === 'cloud' ? 'Na nuvem' : 'Neste navegador'}</span></div>
        {notice && <p className="mt-3 rounded-xl bg-success-subtle p-3 text-xs text-success" role="status">{notice}</p>}
        <div className="mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto pr-2 pb-6 workspace-scrollbar">
          <div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-ink">Tipo<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as EncyclopediaEntryType })} className="mt-1.5 w-full rounded-xl border border-line bg-editor p-2.5 text-sm text-ink">{entryTypes.map((type) => <option key={type} value={type}>{encyclopediaTypeLabels[type]}</option>)}</select></label><label className="text-xs font-semibold text-ink">Situação<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as EncyclopediaStatus })} className="mt-1.5 w-full rounded-xl border border-line bg-editor p-2.5 text-sm text-ink">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
          <TextField label="Nome *" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} maxLength={120} placeholder="Nome pelo qual será citado com @" />
          <TextField label="Outros nomes" value={aliasesText} onChange={setAliasesText} maxLength={500} placeholder="Apelidos separados por vírgula" />
          <TextField label="Resumo rápido" value={draft.summary} onChange={(summary) => setDraft({ ...draft, summary })} maxLength={1000} rows={3} placeholder="O essencial para lembrar durante a escrita." />
          <TextField label="Etiquetas" value={tagsText} onChange={setTagsText} maxLength={500} placeholder="Ex.: núcleo central, mistério" />
          <fieldset><legend className="text-xs font-semibold text-ink">Cor da ficha</legend><div className="mt-2 flex flex-wrap gap-2">{colorOptions.map((option) => <button key={option.value} type="button" onClick={() => setDraft({ ...draft, color: option.value })} title={option.label} aria-label={option.label} aria-pressed={draft.color === option.value} className={cn('flex size-8 items-center justify-center rounded-full border-2 border-surface ring-1', option.style, draft.color === option.value ? 'ring-accent' : 'ring-line')}>{draft.color === option.value && <Check className="size-4 text-white" />}</button>)}</div></fieldset>
          <div className="grid grid-cols-2 gap-3"><label className="flex items-center gap-2 rounded-xl border border-line p-3 text-xs text-ink"><input type="checkbox" checked={draft.isPinned} onChange={(event) => setDraft({ ...draft, isPinned: event.target.checked })} className="accent-accent" />Destacar</label><label className="flex items-center gap-2 rounded-xl border border-line p-3 text-xs text-ink"><input type="checkbox" checked={draft.isSpoiler} onChange={(event) => setDraft({ ...draft, isSpoiler: event.target.checked })} className="accent-accent" />Spoiler</label></div>
          <section className="rounded-xl border border-accent/20 bg-accent-subtle/30 p-4" aria-label={`Perguntas para ${encyclopediaTypeLabels[draft.type]}`}>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Perguntas de {encyclopediaTypeLabels[draft.type]}</p>
            <p className="mt-1 text-xs text-muted">Responda ao que ajuda a escrever; todos os campos são opcionais.</p>
            <div className="mt-4 space-y-5">{questions[draft.type].map((question) => {
              const key = `${draft.type}.${question.id}`;
              const answer = draft.profileAnswers[key];
              const update = (value: string | string[] | boolean) => setDraft((current) => ({ ...current, profileAnswers: { ...current.profileAnswers, [key]: value } }));
              if (question.kind === 'list') return <ListQuestion key={key} question={question} values={Array.isArray(answer) ? answer : []} onChange={update} />;
              if (question.kind === 'check') return <label key={key} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-xs font-medium text-ink"><input type="checkbox" checked={answer === true} onChange={(event) => update(event.target.checked)} className="size-4 accent-accent" />{question.label}</label>;
              if (question.kind === 'select') return <label key={key} className="block text-xs font-semibold text-ink">{question.label}<select value={typeof answer === 'string' ? answer : ''} onChange={(event) => update(event.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-sm text-ink"><option value="">Selecione</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select></label>;
              return <TextField key={key} label={question.label} value={typeof answer === 'string' ? answer : ''} onChange={update} maxLength={500} placeholder="Sua resposta" />;
            })}</div>
          </section>
          <details className="group rounded-xl border border-line" open><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">Construção narrativa</summary><div className="space-y-4 border-t border-line p-4">
            <TextField label={hints.role} value={draft.storyRole} onChange={(storyRole) => setDraft({ ...draft, storyRole })} maxLength={500} rows={2} placeholder="Por que isso importa para a história?" />
            <TextField label={hints.appearance} value={draft.appearance} onChange={(appearance) => setDraft({ ...draft, appearance })} maxLength={4000} rows={3} />
            <TextField label={hints.history} value={draft.history} onChange={(history) => setDraft({ ...draft, history })} maxLength={8000} rows={3} />
          </div></details>
          <details className="rounded-xl border border-line"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">Vínculos e continuidade</summary><div className="space-y-4 border-t border-line p-4">
            <TextField label={hints.connections} value={draft.connections} onChange={(connections) => setDraft({ ...draft, connections })} maxLength={4000} rows={3} placeholder="Quem ou o que se conecta a esta ficha?" />
            <TextField label={hints.rules} value={draft.rules} onChange={(rules) => setDraft({ ...draft, rules })} maxLength={4000} rows={3} placeholder="O que não pode mudar entre capítulos?" />
          </div></details>
          <details className="rounded-xl border border-line"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">Notas livres</summary><div className="border-t border-line p-4"><TextField label="Pesquisa, ideias e detalhes" value={draft.details} onChange={(details) => setDraft({ ...draft, details })} maxLength={30000} rows={6} /></div></details>
        </div>
        {error && <p className="mt-3 text-xs text-danger" role="alert">{error}</p>}
        <div className="mt-5 flex gap-2 border-t border-line pt-4"><button type="button" onClick={() => void submit()} disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60">{saving ? 'Salvando…' : <><Check className="size-4" />{editingId ? 'Salvar alterações' : 'Criar ficha'}</>}</button>{editingId && <button type="button" onClick={() => void remove()} disabled={saving} title="Apagar ficha" aria-label="Apagar ficha" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-danger hover:bg-danger-subtle"><Trash2 className="size-4" /></button>}</div>
      </div>
      </DrawerContent>
    </Drawer>
  </div>;
}
