'use client';

import {
  defaultExtensionRuntime,
  extensionRuntimeStorageKey,
} from '@/features/extensions/catalog';
import {
  AlignLeft,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  AtSign,
  Bold,
  BookOpenText,
  Camera,
  Check,
  ChevronDown,
  Cloud,
  Download,
  FilePlus2,
  FileText,
  Focus,
  Heading2,
  Italic,
  LayoutList,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Quote,
  Redo2,
  Save,
  SeparatorHorizontal,
  ShieldCheck,
  StickyNote,
  Tags,
  Trash2,
  Underline,
  Undo2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui';
import { EncyclopediaView, type EncyclopediaEntryDraft } from '@/features/writing/components/encyclopedia-view';
import {
  defaultMentionExtensionSettings,
  mentionExtensionStorageKey,
  parseMentionExtensionSettings,
} from '@/features/extensions/mention-settings';
import {
  encyclopediaTypeLabels,
  kindLabels,
  mapEncyclopediaEntry,
  parseProfileAnswers,
  statusLabels,
  type EncyclopediaEntry,
  type WritingDocument,
  type WritingDocumentKind,
  type WritingDocumentStatus,
  type WritingProject,
  type WorldbuildingProfile,
  type WritingView,
} from '@/features/writing/types';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import { SoundBinderFooter } from '@/features/sound/components/sound-binder-footer';

function plainTextFromHtml(html: string) {
  return html
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(html: string) {
  const text = plainTextFromHtml(html);
  return text ? text.split(/\s+/u).length : 0;
}

function entityIdsFromHtml(html: string) {
  return Array.from(html.matchAll(/data-entity-id=["']([^"']+)["']/giu), (match) => match[1]);
}

type PagePreset = 'continuous' | 'a5' | 'royal' | 'trade' | 'a4';
type ParagraphSpacing = 'compact' | 'book' | 'airy';

const pagePresets: Record<PagePreset, { label: string; width: string; minHeight: string; pageHeight: number | null }> = {
  continuous: { label: 'Canvas contínuo', width: '54rem', minHeight: 'auto', pageHeight: null },
  a5: { label: 'A5 · 148 × 210 mm', width: '559px', minHeight: 'auto', pageHeight: 794 },
  royal: { label: 'Royal · 156 × 234 mm', width: '590px', minHeight: 'auto', pageHeight: 884 },
  trade: { label: 'Livro · 152 × 229 mm', width: '575px', minHeight: 'auto', pageHeight: 866 },
  a4: { label: 'A4 · 210 × 297 mm', width: '794px', minHeight: 'auto', pageHeight: 1123 },
};

function sanitizeEditorHtml(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const allowed = new Set(['P', 'H2', 'BLOCKQUOTE', 'STRONG', 'B', 'EM', 'I', 'U', 'BR', 'SPAN']);
  template.content.querySelectorAll('*').forEach((element) => {
    if (!allowed.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    const keepSceneBreak = element.tagName === 'P' && element.classList.contains('scene-break');
    const entityId = element.tagName === 'SPAN' && isUuid(element.getAttribute('data-entity-id'))
      ? element.getAttribute('data-entity-id')
      : null;
    const entityType = element.tagName === 'SPAN' ? element.getAttribute('data-entity-type') : null;
    const entityLabel = element.tagName === 'SPAN'
      ? element.getAttribute('data-entity-label') ?? element.textContent?.replace(/^@/u, '') ?? ''
      : '';
    Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
    if (keepSceneBreak) element.className = 'scene-break';
    if (entityId && entityType) {
      element.className = 'writing-entity-mention';
      element.setAttribute('data-entity-id', entityId);
      element.setAttribute('data-entity-type', entityType);
      element.setAttribute('data-entity-label', entityLabel.slice(0, 120));
      element.setAttribute('contenteditable', 'false');
    }
  });
  return template.innerHTML;
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function safeEncyclopediaEntries(value: string | null): EncyclopediaEntry[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Array<Partial<EncyclopediaEntry>>;
    if (!Array.isArray(parsed)) return [];
    const allowedTypes = new Set(['character', 'location', 'organization', 'object', 'concept', 'event']);
    return parsed.flatMap((entry) => {
      if (!isUuid(entry.id) || !allowedTypes.has(String(entry.type)) || typeof entry.name !== 'string' || !entry.name.trim()) return [];
      return [{
        id: entry.id,
        type: entry.type as EncyclopediaEntry['type'],
        name: entry.name.slice(0, 120),
        aliases: Array.isArray(entry.aliases) ? entry.aliases.filter((alias): alias is string => typeof alias === 'string').slice(0, 20) : [],
        summary: typeof entry.summary === 'string' ? entry.summary.slice(0, 1000) : '',
        details: typeof entry.details === 'string' ? entry.details.slice(0, 30000) : '',
        color: typeof entry.color === 'string' ? entry.color : 'violet',
        status: entry.status === 'canon' || entry.status === 'archived' ? entry.status : 'draft',
        tags: Array.isArray(entry.tags) ? entry.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 12) : [],
        storyRole: typeof entry.storyRole === 'string' ? entry.storyRole.slice(0, 500) : '',
        appearance: typeof entry.appearance === 'string' ? entry.appearance.slice(0, 4000) : '',
        history: typeof entry.history === 'string' ? entry.history.slice(0, 8000) : '',
        connections: typeof entry.connections === 'string' ? entry.connections.slice(0, 4000) : '',
        rules: typeof entry.rules === 'string' ? entry.rules.slice(0, 4000) : '',
        isPinned: entry.isPinned === true,
        isSpoiler: entry.isSpoiler === true,
        profileAnswers: parseProfileAnswers(entry.profileAnswers),
        templateId: typeof entry.templateId === 'string' ? entry.templateId.slice(0, 80) : '',
        updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : new Date().toISOString(),
      }];
    });
  } catch {
    return [];
  }
}

function safeProject(value: string | null, remoteProject: WritingProject): WritingProject | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<WritingProject> & { documents?: Array<Record<string, unknown>> };
    if (!parsed.title || !Array.isArray(parsed.documents) || !parsed.documents.length) return null;
    const idMap = new Map<string, string>();
    const rawDocuments = parsed.documents.filter((item) => (
      typeof item?.id === 'string'
      && typeof item.title === 'string'
      && typeof item.contentHtml === 'string'
      && typeof item.synopsis === 'string'
      && typeof item.goal === 'number'
    ));
    rawDocuments.forEach((item) => idMap.set(item.id as string, isUuid(item.id) ? item.id : crypto.randomUUID()));
    const documents: WritingDocument[] = rawDocuments.map((item, index) => {
      const rawStatus = String(item.status);
      const legacyStatus = rawStatus === 'Em revisão' ? 'review' : rawStatus === 'Final' ? 'final' : 'draft';
      const kind = ['folder', 'page', 'chapter', 'scene', 'note', 'draft'].includes(String(item.kind))
        ? item.kind as WritingDocumentKind
        : 'chapter';
      return {
        id: idMap.get(item.id as string) as string,
        parentId: typeof item.parentId === 'string' ? idMap.get(item.parentId) ?? null : null,
        kind,
        title: item.title as string,
        contentHtml: sanitizeEditorHtml(item.contentHtml as string),
        synopsis: item.synopsis as string,
        status: ['draft', 'review', 'final'].includes(rawStatus)
          ? item.status as WritingDocumentStatus
          : legacyStatus,
        goal: item.goal as number,
        position: typeof item.position === 'number' ? item.position : index,
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
      };
    });
    if (!documents.length) return null;
    return {
      id: remoteProject.id,
      title: parsed.title,
      documents,
      encyclopediaEntries: remoteProject.encyclopediaEntries,
      encyclopediaPersistence: remoteProject.encyclopediaPersistence,
      worldbuildingProfile: remoteProject.worldbuildingProfile,
      activeDocumentId: typeof parsed.activeDocumentId === 'string'
        ? idMap.get(parsed.activeDocumentId) ?? documents[0].id
        : documents[0].id,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function htmlToMarkdown(document: WritingDocument) {
  return document.contentHtml
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '$1')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .trim();
}

function ToolbarButton({
  label,
  shortcut,
  active = false,
  comfortable = false,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
  comfortable?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-label={shortcut ? `${label}, ${shortcut}` : label}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={cn(
        'flex size-8 items-center justify-center rounded-control text-muted transition-colors hover:bg-accent-subtle hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        comfortable && 'size-10 rounded-[0.625rem] text-ink hover:bg-accent-subtle hover:text-accent [&_svg]:size-[1.125rem]',
        active && 'bg-accent-subtle text-accent',
      )}
    >
      {children}
    </button>
  );
}

const collectionConfig = {
  chapters: {
    title: 'Capítulos e páginas',
    description: 'Organize as partes longas do manuscrito e abra qualquer uma diretamente no editor.',
    kinds: ['chapter', 'page', 'draft'] as WritingDocumentKind[],
    createKind: 'chapter' as WritingDocumentKind,
    action: 'Novo capítulo',
  },
  scenes: {
    title: 'Cenas',
    description: 'Trabalhe em unidades menores e acompanhe como cada cena participa da obra.',
    kinds: ['scene'] as WritingDocumentKind[],
    createKind: 'scene' as WritingDocumentKind,
    action: 'Nova cena',
  },
  notes: {
    title: 'Notas',
    description: 'Guarde observações internas que não entram no texto compilado.',
    kinds: ['note'] as WritingDocumentKind[],
    createKind: 'note' as WritingDocumentKind,
    action: 'Nova nota',
  },
};

function WritingCollection({
  view,
  documents,
  onCreate,
  onOpen,
}: {
  view: Exclude<WritingView, 'editor' | 'encyclopedia'>;
  documents: WritingDocument[];
  onCreate: (kind: WritingDocumentKind) => void;
  onOpen: (id: string) => void;
}) {
  const config = collectionConfig[view];
  const visibleDocuments = documents
    .filter((item) => config.kinds.includes(item.kind))
    .sort((a, b) => a.position - b.position);
  const Icon = view === 'notes' ? StickyNote : LayoutList;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-editor p-6 shadow-soft sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Organização da obra</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">{config.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{config.description}</p>
        </div>
        <button type="button" onClick={() => onCreate(config.createKind)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"><Plus className="size-4" />{config.action}</button>
      </div>
      {visibleDocuments.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleDocuments.map((item) => (
            <button key={item.id} type="button" onClick={() => onOpen(item.id)} className="group rounded-2xl border border-line bg-editor p-6 text-left shadow-soft transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-accent hover:shadow-floating">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent"><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-lg font-semibold text-ink">{item.title}</span>
                  <span className="mt-1 block text-xs text-muted">{kindLabels[item.kind]} · {statusLabels[item.status]} · {countWords(item.contentHtml)} palavras</span>
                  <span className="mt-3 block line-clamp-2 text-sm leading-relaxed text-muted">{item.synopsis || 'Sem sinopse. Abra no editor para desenvolver este item.'}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-editor px-6 py-16 text-center shadow-soft">
          <Icon className="mx-auto size-7 text-accent" />
          <p className="mt-4 font-serif text-xl font-semibold text-ink">Esta seção ainda está em branco</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Crie o primeiro item para começar a organizar esta parte da obra.</p>
        </div>
      )}
    </div>
  );
}

export function WritingStudio({
  userId,
  initialProject,
  initialView,
  extensionAccess,
}: {
  userId: string;
  initialProject: WritingProject;
  initialView: WritingView;
  extensionAccess: typeof defaultExtensionRuntime;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const storageKey = `autor-copilot:writing-project:${userId}`;
  const snapshotKey = `${storageKey}:snapshots`;
  const viewPreferencesKey = `${storageKey}:view-preferences`;
  const encyclopediaStorageKey = `${storageKey}:encyclopedia`;
  const editorRef = useRef<HTMLDivElement>(null);
  const mentionRangeRef = useRef<Range | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const renderedDocumentRef = useRef('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const migratingLocalDraftRef = useRef(false);
  const [project, setProject] = useState<WritingProject>(initialProject);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'offline' | 'error'>('saved');
  const [showBinder, setShowBinder] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [distractionFree, setDistractionFree] = useState(false);
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [formatSelection, setFormatSelection] = useState<{ left: number; top: number } | null>(null);
  const [editorEmpty, setEditorEmpty] = useState(true);
  const [pagePreset, setPagePreset] = useState<PagePreset>('continuous');
  const [wideMargins, setWideMargins] = useState(false);
  const [paragraphIndent, setParagraphIndent] = useState(true);
  const [paragraphSpacing, setParagraphSpacing] = useState<ParagraphSpacing>('book');
  const [viewPreferencesHydrated, setViewPreferencesHydrated] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPosition, setMentionPosition] = useState({ left: 0, top: 0 });
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionSettings, setMentionSettings] = useState(defaultMentionExtensionSettings);
  const [extensionRuntime, setExtensionRuntime] = useState(extensionAccess);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const activeDocument = useMemo(
    () => project.documents.find((item) => item.id === project.activeDocumentId) ?? project.documents[0],
    [project],
  );
  const wordCount = countWords(activeDocument.contentHtml);
  const characterCount = plainTextFromHtml(activeDocument.contentHtml).length;
  const progress = activeDocument.goal > 0 && wordCount > 0
    ? Math.min(100, Math.max(1, Math.round((wordCount / activeDocument.goal) * 100)))
    : 0;
  const currentPagePreset = pagePresets[pagePreset];
  const selectedEntity = project.encyclopediaEntries.find((entry) => entry.id === selectedEntityId) ?? null;
  const mentionMatches = useMemo(() => {
    if (mentionQuery === null) return [];
    const normalized = mentionQuery.toLocaleLowerCase('pt-BR');
    return project.encyclopediaEntries
      .filter((entry) => entry.status !== 'archived' && [entry.name, ...(mentionSettings.searchAliases ? entry.aliases : [])].some((value) => value.toLocaleLowerCase('pt-BR').includes(normalized)))
      .sort((a, b) => (mentionSettings.prioritizePinned ? Number(b.isPinned) - Number(a.isPinned) : 0) || (mentionSettings.groupByType ? a.type.localeCompare(b.type) : 0) || a.name.localeCompare(b.name, 'pt-BR'))
      .slice(0, mentionSettings.suggestionView === 'rich' ? 6 : 9);
  }, [mentionQuery, mentionSettings.groupByType, mentionSettings.prioritizePinned, mentionSettings.searchAliases, mentionSettings.suggestionView, project.encyclopediaEntries]);
  const mentionStats = useMemo(() => {
    const ids = entityIdsFromHtml(activeDocument.contentHtml);
    const knownEntries = new Map(project.encyclopediaEntries.map((entry) => [entry.id, entry]));
    const uniqueIds = new Set(ids);
    const brokenIds = new Set(ids.filter((id) => !knownEntries.has(id)));
    const byType = ids.reduce<Partial<Record<EncyclopediaEntry['type'], number>>>((counts, id) => {
      const type = knownEntries.get(id)?.type;
      if (type) counts[type] = (counts[type] ?? 0) + 1;
      return counts;
    }, {});
    return { total: ids.length, unique: uniqueIds.size, broken: brokenIds.size, byType };
  }, [activeDocument.contentHtml, project.encyclopediaEntries]);
  const saveLabel = saveState === 'saving'
    ? 'Salvando…'
    : saveState === 'offline'
      ? 'Salvo localmente; sincronização com a nuvem pendente'
      : saveState === 'error'
        ? 'Não foi possível salvar'
        : 'Salvo localmente e na nuvem';

  const syncProject = useCallback(async (nextProject: WritingProject) => {
    const { error: workError } = await supabase
      .from('works')
      .update({ title: nextProject.title })
      .eq('id', nextProject.id)
      .eq('owner_id', userId);
    if (workError) throw workError;

    const { error: documentsError } = await supabase
      .from('writing_documents')
      .upsert(nextProject.documents.map((item) => ({
        id: item.id,
        work_id: nextProject.id,
        owner_id: userId,
        parent_id: item.parentId,
        kind: item.kind,
        title: item.title,
        content_html: sanitizeEditorHtml(item.contentHtml),
        synopsis: item.synopsis,
        status: item.status,
        word_goal: item.goal,
        position: item.position,
      })), { onConflict: 'id' });
    if (documentsError) throw documentsError;

    if (migratingLocalDraftRef.current) {
      const documentIds = nextProject.documents.map((item) => item.id);
      const { error: cleanupError } = await supabase
        .from('writing_documents')
        .delete()
        .eq('work_id', nextProject.id)
        .eq('owner_id', userId)
        .not('id', 'in', `(${documentIds.join(',')})`);
      if (cleanupError) throw cleanupError;
      migratingLocalDraftRef.current = false;
    }
  }, [supabase, userId]);

  useEffect(() => {
    const stored = safeProject(window.localStorage.getItem(storageKey), initialProject);
    const hydrationTimer = window.setTimeout(() => {
      const remoteLooksUntouched = initialProject.documents.every((item) => (
        !item.synopsis
        && countWords(item.contentHtml) <= 6
        && /^Capítulo \d+$/u.test(item.title)
      ));
      const storedHasWriting = stored?.documents.some((item) => (
        item.synopsis || countWords(item.contentHtml) > 6 || !/^Capítulo \d+$/u.test(item.title)
      ));
      const storedIsNewer = stored
        && Date.parse(stored.updatedAt) > Date.parse(initialProject.updatedAt);
      if (stored && ((remoteLooksUntouched && storedHasWriting) || storedIsNewer)) {
        migratingLocalDraftRef.current = true;
        setProject(stored);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, [initialProject, storageKey]);

  useEffect(() => {
    const encyclopediaTimer = window.setTimeout(async () => {
      const localEntries = safeEncyclopediaEntries(window.localStorage.getItem(encyclopediaStorageKey));
      if (!localEntries.length) return;
      if (initialProject.encyclopediaPersistence === 'local') {
        setProject((current) => ({ ...current, encyclopediaEntries: localEntries }));
        return;
      }
      if (initialProject.encyclopediaEntries.length) return;
      const { data, error } = await supabase
        .from('encyclopedia_entries')
        .upsert(localEntries.map((entry) => ({
          id: entry.id,
          work_id: initialProject.id,
          owner_id: userId,
          entry_type: entry.type,
          name: entry.name,
          aliases: entry.aliases,
          summary: entry.summary,
          details: entry.details,
          color: entry.color,
          status: entry.status,
          tags: entry.tags,
          story_role: entry.storyRole,
          appearance: entry.appearance,
          history: entry.history,
          connections: entry.connections,
          rules: entry.rules,
          is_pinned: entry.isPinned,
          is_spoiler: entry.isSpoiler,
          profile_answers: entry.profileAnswers,
          template_id: entry.templateId,
        })), { onConflict: 'id' })
        .select('*');
      if (error || !data) return;
      const migrated = data.map(mapEncyclopediaEntry);
      window.localStorage.removeItem(encyclopediaStorageKey);
      setProject((current) => ({ ...current, encyclopediaEntries: migrated }));
    }, 0);
    return () => window.clearTimeout(encyclopediaTimer);
  }, [encyclopediaStorageKey, initialProject, supabase, userId]);

  useEffect(() => {
    const extensionsTimer = window.setTimeout(() => {
      setMentionSettings(parseMentionExtensionSettings(window.localStorage.getItem(mentionExtensionStorageKey)));
      setExtensionRuntime(extensionAccess);
      window.localStorage.setItem(extensionRuntimeStorageKey, JSON.stringify(extensionAccess));
    }, 0);
    return () => window.clearTimeout(extensionsTimer);
  }, [extensionAccess]);

  useEffect(() => {
    const narrowScreen = window.matchMedia('(max-width: 959px)').matches;
    const mediumScreen = window.matchMedia('(min-width: 960px) and (max-width: 1279px)').matches;
    if (!narrowScreen && !mediumScreen) return;
    const responsiveTimer = window.setTimeout(() => {
      if (narrowScreen) setShowBinder(false);
      setShowInspector(false);
    }, 0);
    return () => window.clearTimeout(responsiveTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const stateTimer = window.setTimeout(() => setSaveState('saving'), 0);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        const next = { ...project, updatedAt: new Date().toISOString() };
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        setSaveState('error');
      }
    }, 350);
    const cloudTimer = window.setTimeout(async () => {
      try {
        await syncProject(project);
        setSaveState('saved');
      } catch {
        setSaveState('offline');
      }
    }, 1100);
    return () => {
      window.clearTimeout(stateTimer);
      window.clearTimeout(cloudTimer);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [hydrated, project, storageKey, syncProject]);

  useEffect(() => {
    if (!hydrated || !editorRef.current) return;
    const renderKey = `${activeDocument.id}:${project.updatedAt}`;
    if (renderedDocumentRef.current === renderKey) return;
    editorRef.current.innerHTML = sanitizeEditorHtml(activeDocument.contentHtml);
    setEditorEmpty(plainTextFromHtml(activeDocument.contentHtml).length === 0);
    renderedDocumentRef.current = renderKey;
  }, [activeDocument.contentHtml, activeDocument.id, hydrated, project.updatedAt]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const knownEntries = new Map(project.encyclopediaEntries.map((entry) => [entry.id, entry]));
    editor.querySelectorAll<HTMLElement>('[data-entity-id]').forEach((mention) => {
      const entry = knownEntries.get(mention.dataset.entityId ?? '');
      const broken = extensionRuntime['lab.reference-guardian'] && mentionSettings.verifyReferences && !entry;
      mention.classList.toggle('writing-entity-mention-broken', broken);
      if (broken) mention.title = 'Referência sem entrada correspondente na Enciclopédia';
      else if (entry && mentionSettings.hoverPreview) mention.title = `${entry.name} · ${encyclopediaTypeLabels[entry.type]}${entry.summary ? `\n${entry.summary}` : ''}`;
      else mention.removeAttribute('title');
    });
  }, [activeDocument.contentHtml, extensionRuntime, mentionSettings.hoverPreview, mentionSettings.verifyReferences, project.encyclopediaEntries]);

  useEffect(() => {
    const preferencesTimer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(viewPreferencesKey) ?? '{}') as Record<string, unknown>;
        if (stored.pagePreset && Object.hasOwn(pagePresets, String(stored.pagePreset))) setPagePreset(stored.pagePreset as PagePreset);
        if (typeof stored.wideMargins === 'boolean') setWideMargins(stored.wideMargins);
        if (typeof stored.paragraphIndent === 'boolean') setParagraphIndent(stored.paragraphIndent);
        if (stored.paragraphSpacing === 'compact' || stored.paragraphSpacing === 'book' || stored.paragraphSpacing === 'airy') setParagraphSpacing(stored.paragraphSpacing);
      } catch {
        // Preferências inválidas voltam aos padrões editoriais seguros.
      }
      setViewPreferencesHydrated(true);
    }, 0);
    return () => window.clearTimeout(preferencesTimer);
  }, [viewPreferencesKey]);

  useEffect(() => {
    if (!viewPreferencesHydrated) return;
    try {
      window.localStorage.setItem(viewPreferencesKey, JSON.stringify({ pagePreset, wideMargins, paragraphIndent, paragraphSpacing }));
    } catch {
      // O editor continua utilizável quando o navegador bloqueia armazenamento local.
    }
  }, [pagePreset, paragraphIndent, paragraphSpacing, viewPreferencesHydrated, viewPreferencesKey, wideMargins]);

  useEffect(() => {
    const editor = editorRef.current;
    const pageHeight = pagePresets[pagePreset].pageHeight;
    if (!editor || !pageHeight) {
      setPageCount(1);
      return;
    }
    const measure = () => setPageCount(Math.max(1, Math.ceil((editor.scrollHeight + 190) / pageHeight)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(editor);
    return () => observer.disconnect();
  }, [activeDocument.id, pagePreset, wideMargins]);

  const updateActiveDocument = useCallback((changes: Partial<WritingDocument>) => {
    setProject((current) => ({
      ...current,
      documents: current.documents.map((item) => (
        item.id === current.activeDocumentId ? { ...item, ...changes } : item
      )),
    }));
  }, []);

  const syncEditorState = useCallback(() => {
    if (!editorRef.current) return;
    setEditorEmpty((editorRef.current.textContent ?? '').replace(/\u00a0/gu, ' ').trim().length === 0);
    updateActiveDocument({ contentHtml: editorRef.current.innerHTML });
    if (typewriterMode && scrollRef.current) {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const caret = selection.getRangeAt(0).getBoundingClientRect();
        const viewport = scrollRef.current.getBoundingClientRect();
        scrollRef.current.scrollBy({ top: caret.top - (viewport.top + viewport.height / 2), behavior: 'smooth' });
      }
    }
  }, [typewriterMode, updateActiveDocument]);

  const updateFormatSelection = useCallback(() => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!editor || !selection?.rangeCount || selection.isCollapsed || !selection.toString().trim() || !editor.contains(selection.anchorNode) || !editor.contains(selection.focusNode)) {
      setFormatSelection(null);
      return;
    }
    const rect = selection.getRangeAt(0).getClientRects()[0] ?? selection.getRangeAt(0).getBoundingClientRect();
    const toolbarWidth = Math.min(410, window.innerWidth - 24);
    const left = Math.max(toolbarWidth / 2 + 12, Math.min(rect.left + rect.width / 2, window.innerWidth - toolbarWidth / 2 - 12));
    const top = rect.top > 72 ? rect.top - 58 : rect.bottom + 10;
    setFormatSelection({ left, top });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateFormatSelection);
    window.addEventListener('resize', updateFormatSelection);
    return () => {
      document.removeEventListener('selectionchange', updateFormatSelection);
      window.removeEventListener('resize', updateFormatSelection);
    };
  }, [updateFormatSelection]);

  const detectMention = useCallback(() => {
    if (!extensionRuntime['lab.context-mentions'] || !mentionSettings.enabled || !editorRef.current) {
      setMentionQuery(null);
      return;
    }
    const selection = window.getSelection();
    if (!selection?.rangeCount || !selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE || !editorRef.current.contains(node)) {
      setMentionQuery(null);
      return;
    }
    const beforeCaret = (node.textContent ?? '').slice(0, range.startOffset);
    const match = beforeCaret.match(/(?:^|\s)@([\p{L}\p{N}_-]*)$/u);
    if (!match) {
      setMentionQuery(null);
      return;
    }
    const mentionRange = range.cloneRange();
    mentionRange.setStart(node, range.startOffset - match[1].length - 1);
    mentionRangeRef.current = mentionRange;
    const rect = range.getBoundingClientRect();
    setMentionPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - 300)), top: rect.bottom + 8 });
    setMentionQuery(match[1]);
    setMentionIndex(0);
  }, [extensionRuntime, mentionSettings.enabled]);

  const handleEditorInput = useCallback(() => {
    syncEditorState();
    detectMention();
  }, [detectMention, syncEditorState]);

  const insertEntityMention = useCallback((entry: EncyclopediaEntry) => {
    const range = mentionRangeRef.current;
    if (!range || !editorRef.current) return;
    range.deleteContents();
    const mention = document.createElement('span');
    mention.className = 'writing-entity-mention';
    mention.dataset.entityId = entry.id;
    mention.dataset.entityType = entry.type;
    mention.dataset.entityLabel = entry.name;
    mention.contentEditable = 'false';
    mention.textContent = `@${entry.name}`;
    const space = document.createTextNode('\u00a0');
    range.insertNode(space);
    range.insertNode(mention);
    const selection = window.getSelection();
    range.setStartAfter(space);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    setMentionQuery(null);
    setSelectedEntityId(entry.id);
    syncEditorState();
  }, [syncEditorState]);

  const handleEditorKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (mentionQuery === null) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMentionQuery(null);
      return;
    }
    if (!mentionMatches.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setMentionIndex((current) => {
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        return (current + direction + mentionMatches.length) % mentionMatches.length;
      });
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      insertEntityMention(mentionMatches[mentionIndex] ?? mentionMatches[0]);
    }
  }, [insertEntityMention, mentionIndex, mentionMatches, mentionQuery]);

  const handleEditorClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!extensionRuntime['lab.context-mentions'] || !mentionSettings.openContextOnClick) return;
    const target = event.target as HTMLElement;
    const mention = target.closest<HTMLElement>('[data-entity-id]');
    if (!mention?.dataset.entityId) return;
    setSelectedEntityId(mention.dataset.entityId);
    if (!showInspector) setShowInspector(true);
  }, [extensionRuntime, mentionSettings.openContextOnClick, showInspector]);

  const runCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorState();
  }, [syncEditorState]);

  const toggleBinder = useCallback(() => {
    if (window.matchMedia('(max-width: 959px)').matches) setShowInspector(false);
    setShowBinder((current) => !current);
  }, []);

  const toggleInspector = useCallback(() => {
    if (window.matchMedia('(max-width: 959px)').matches) setShowBinder(false);
    setShowInspector((current) => !current);
  }, []);

  const saveNow = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    try {
      const next = { ...project, updatedAt: new Date().toISOString() };
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setProject(next);
      setSaveState('saving');
      await syncProject(next);
      setSaveState('saved');
    } catch {
      setSaveState('offline');
    }
  }, [project, storageKey, syncProject]);

  const createDocument = useCallback((kind: WritingDocumentKind = 'chapter') => {
    const id = crypto.randomUUID();
    const sameKindCount = project.documents.filter((item) => item.kind === kind).length;
    const nextDocument: WritingDocument = {
      id,
      parentId: null,
      kind,
      title: `${kindLabels[kind]} ${sameKindCount + 1}`,
      contentHtml: '',
      synopsis: '',
      status: 'draft',
      goal: kind === 'chapter' || kind === 'scene' ? 1800 : 0,
      position: project.documents.length,
      updatedAt: new Date().toISOString(),
    };
    renderedDocumentRef.current = '';
    setFormatSelection(null);
    setProject((current) => ({
      ...current,
      activeDocumentId: id,
      documents: [...current.documents, nextDocument],
    }));
    router.push(`/write/editor?work=${project.id}&document=${id}`);
  }, [project.documents, project.id, router]);

  const selectDocument = useCallback((id: string) => {
    renderedDocumentRef.current = '';
    setFormatSelection(null);
    setProject((current) => ({ ...current, activeDocumentId: id }));
    router.replace(`/write/editor?work=${project.id}&document=${id}`, { scroll: false });
  }, [project.id, router]);

  const createSnapshot = useCallback(async (documentToSnapshot = activeDocument) => {
    try {
      const existing = JSON.parse(window.localStorage.getItem(snapshotKey) ?? '[]') as unknown[];
      const snapshot = { createdAt: new Date().toISOString(), document: documentToSnapshot };
      window.localStorage.setItem(snapshotKey, JSON.stringify([snapshot, ...existing].slice(0, 20)));
      const { error } = await supabase.from('writing_snapshots').insert({
        document_id: documentToSnapshot.id,
        owner_id: userId,
        title: documentToSnapshot.title,
        content_html: documentToSnapshot.contentHtml,
        synopsis: documentToSnapshot.synopsis,
        status: documentToSnapshot.status,
      });
      if (error) throw error;
      setSaveState('saved');
    } catch {
      setSaveState('offline');
    }
  }, [activeDocument, snapshotKey, supabase, userId]);

  const moveDocument = useCallback((documentId: string, direction: -1 | 1) => {
    setProject((current) => {
      const documents = [...current.documents].sort((a, b) => a.position - b.position);
      const index = documents.findIndex((item) => item.id === documentId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= documents.length) return current;
      [documents[index], documents[targetIndex]] = [documents[targetIndex], documents[index]];
      return {
        ...current,
        documents: documents.map((item, position) => ({ ...item, position })),
      };
    });
  }, []);

  const categorizeDocument = useCallback((documentId: string, kind: WritingDocumentKind) => {
    setProject((current) => ({
      ...current,
      documents: current.documents.map((item) => item.id === documentId ? { ...item, kind } : item),
    }));
  }, []);

  const deleteDocument = useCallback(async (documentId: string) => {
    const documentToDelete = project.documents.find((item) => item.id === documentId);
    if (!documentToDelete || project.documents.length === 1) return;
    if (!window.confirm(`Apagar “${documentToDelete.title}”? Um instantâneo será criado antes.`)) return;
    await createSnapshot(documentToDelete);
    const { error } = await supabase
      .from('writing_documents')
      .delete()
      .eq('id', documentId)
      .eq('owner_id', userId);
    if (error) {
      setSaveState('offline');
      return;
    }
    const remaining = project.documents.filter((item) => item.id !== documentId)
      .map((item, position) => ({ ...item, position }));
    const nextActiveId = documentId === project.activeDocumentId ? remaining[0].id : project.activeDocumentId;
    renderedDocumentRef.current = '';
    setProject((current) => ({ ...current, documents: remaining, activeDocumentId: nextActiveId }));
    router.replace(`/write/editor?work=${project.id}&document=${nextActiveId}`);
  }, [createSnapshot, project, router, supabase, userId]);

  const saveEncyclopediaEntry = useCallback(async (draft: EncyclopediaEntryDraft, entryId?: string) => {
    const id = entryId ?? crypto.randomUUID();
    const localEntry: EncyclopediaEntry = { id, ...draft, updatedAt: new Date().toISOString() };
    const saveLocally = () => {
      const nextEntries = [...project.encyclopediaEntries.filter((entry) => entry.id !== id), localEntry]
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      window.localStorage.setItem(encyclopediaStorageKey, JSON.stringify(nextEntries));
      setProject((current) => ({
        ...current,
        encyclopediaEntries: nextEntries,
        encyclopediaPersistence: 'local',
      }));
    };
    if (project.encyclopediaPersistence === 'local') {
      saveLocally();
      return;
    }
    const payload = {
      id,
      work_id: project.id,
      owner_id: userId,
      entry_type: draft.type,
      name: draft.name,
      aliases: draft.aliases,
      summary: draft.summary,
      details: draft.details,
      color: draft.color,
      status: draft.status,
      tags: draft.tags,
      story_role: draft.storyRole,
      appearance: draft.appearance,
      history: draft.history,
      connections: draft.connections,
      rules: draft.rules,
      is_pinned: draft.isPinned,
      is_spoiler: draft.isSpoiler,
      profile_answers: draft.profileAnswers,
      template_id: draft.templateId,
    };
    const { data, error } = await supabase
      .from('encyclopedia_entries')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();
    if (error?.code === 'PGRST205') {
      saveLocally();
      return;
    }
    if (error?.code === 'PGRST204' || error?.code === '42703') throw new Error('Atualize o banco com a migration da Enciclopédia antes de salvar fichas novas.');
    if (error || !data) throw error ?? new Error('A entrada não foi devolvida pelo Supabase.');
    const nextEntry = mapEncyclopediaEntry(data);
    setProject((current) => ({
      ...current,
      encyclopediaEntries: [...current.encyclopediaEntries.filter((entry) => entry.id !== id), nextEntry]
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    }));
  }, [encyclopediaStorageKey, project.encyclopediaEntries, project.encyclopediaPersistence, project.id, supabase, userId]);

  const saveWorldbuildingProfile = useCallback(async (profile: WorldbuildingProfile) => {
    const { error } = await supabase.from('worldbuilding_profiles').upsert({
      work_id: project.id,
      owner_id: userId,
      methodology: profile.methodology,
      mice_focus: profile.miceFocus,
      genres: profile.genres,
      pov_mode: profile.povMode,
      psychic_distance: profile.psychicDistance,
      incluing_enabled: profile.incluingEnabled,
      genre_answers: profile.genreAnswers,
      lore_answers: profile.loreAnswers,
    }, { onConflict: 'work_id,owner_id' });
    if (error?.code === 'PGRST205' || error?.code === 'PGRST204' || error?.code === '42703') {
      throw new Error('Aplique a migration mais recente da Enciclopédia para salvar os fundamentos da obra.');
    }
    if (error) throw error;
    setProject((current) => ({ ...current, worldbuildingProfile: profile }));
  }, [project.id, supabase, userId]);

  const deleteEncyclopediaEntry = useCallback(async (entryId: string) => {
    let persistence = project.encyclopediaPersistence;
    if (project.encyclopediaPersistence === 'cloud') {
      const { error } = await supabase
        .from('encyclopedia_entries')
        .delete()
        .eq('id', entryId)
        .eq('owner_id', userId);
      if (error?.code === 'PGRST205') persistence = 'local';
      else if (error) throw error;
    }
    const nextEntries = project.encyclopediaEntries.filter((entry) => entry.id !== entryId);
    if (persistence === 'local') {
      window.localStorage.setItem(encyclopediaStorageKey, JSON.stringify(nextEntries));
    }
    setProject((current) => ({
      ...current,
      encyclopediaEntries: nextEntries,
      encyclopediaPersistence: persistence,
    }));
    setSelectedEntityId((current) => current === entryId ? null : current);
  }, [encyclopediaStorageKey, project.encyclopediaEntries, project.encyclopediaPersistence, supabase, userId]);

  const exportMarkdown = useCallback(() => {
    const content = `# ${activeDocument.title}\n\n${htmlToMarkdown(activeDocument)}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${activeDocument.title.toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, '-')}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [activeDocument]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveNow();
      }
      if (modifier && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        createDocument();
      }
      if (extensionRuntime['lab.immersive-focus'] && modifier && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setDistractionFree((current) => !current);
      }
      if (extensionRuntime['lab.typewriter-mode'] && modifier && event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        setTypewriterMode((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [createDocument, extensionRuntime, saveNow]);

  return (
    <div className={cn('writing-studio-shell flex h-full min-h-0 flex-col overflow-hidden text-ink', distractionFree && 'fixed inset-0 z-[70] h-dvh')}>

      {distractionFree && (
        <button type="button" onClick={() => setDistractionFree(false)} className="fixed right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-floating hover:text-ink" aria-label="Sair do modo sem distrações" title="Sair do modo sem distrações">
          <X className="size-4" />
        </button>
      )}

      <div className="relative flex min-h-0 flex-1">
        {!distractionFree && showBinder && initialView !== 'encyclopedia' && (
          <aside className="writing-binder absolute inset-y-0 left-0 z-30 flex w-[14rem] shrink-0 flex-col border-r shadow-floating lg:static lg:shadow-none" aria-label="Estrutura da obra">
            <div className="border-b border-line px-3 pb-4 pt-20 xl:pt-6">
              <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Obra em curso</p><button type="button" onClick={toggleBinder} className="flex size-7 items-center justify-center rounded-control text-muted hover:bg-surface-muted lg:hidden" aria-label="Fechar estrutura"><X className="size-4" /></button></div>
              <input value={project.title} onChange={(event) => setProject((current) => ({ ...current, title: event.target.value }))} aria-label="Título da obra" className="mt-2 w-full bg-transparent font-serif text-base font-semibold leading-tight text-ink outline-none placeholder:text-muted" placeholder="Título da obra" />
            </div>
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-4">
              <div className="mb-3 flex items-center justify-between gap-2 px-2"><div><h2 className="text-xs font-semibold text-ink">Manuscrito</h2><p className="mt-0.5 text-[10px] text-muted">{project.documents.length} {project.documents.length === 1 ? 'documento' : 'documentos'}</p></div><button type="button" onClick={() => createDocument('chapter')} className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-accent hover:bg-accent-subtle" aria-label="Novo capítulo" title="Novo capítulo"><Plus className="size-4" /></button></div>
              <div className="space-y-1">
                {project.documents.slice().sort((a, b) => a.position - b.position).map((item, index) => (
                  <div key={item.id} className={cn('group flex min-h-12 items-center rounded-lg border border-transparent transition-colors', item.id === activeDocument.id ? 'border-accent/20 bg-accent-subtle text-accent' : 'text-muted hover:border-line hover:bg-surface hover:text-ink')}>
                    <button type="button" onClick={() => selectDocument(item.id)} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-2 text-left text-sm">
                      <FileText className="size-3.5 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium">{item.title}</span>
                        <span className="mt-0.5 flex items-center gap-2 text-[10px]">
                          {countWords(item.contentHtml) > 0
                            ? <span className="tabular-nums opacity-75">{countWords(item.contentHtml).toLocaleString('pt-BR')} palavras</span>
                            : <span className="font-medium opacity-75">Ainda vazio</span>}
                        </span>
                      </span>
                      <span className="sr-only">Documento {index + 1}</span>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger aria-label={`Ações de ${item.title}`} title="Mover, categorizar ou apagar" className="mr-1 flex size-8 shrink-0 items-center justify-center rounded-control opacity-70 outline-none hover:bg-surface group-hover:opacity-100 focus-visible:ring-2 focus-visible:ring-focus"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                        <DropdownMenuItem disabled={index === 0} onSelect={() => moveDocument(item.id, -1)}><ArrowUp className="size-4" />Mover para cima</DropdownMenuItem>
                        <DropdownMenuItem disabled={index === project.documents.length - 1} onSelect={() => moveDocument(item.id, 1)}><ArrowDown className="size-4" />Mover para baixo</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger><Tags className="size-4" />Categorizar como</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {(Object.entries(kindLabels) as Array<[WritingDocumentKind, string]>).map(([kind, label]) => (
                              <DropdownMenuItem key={kind} onSelect={() => categorizeDocument(item.id, kind)}>{label}{item.kind === kind && <Check className="ml-auto size-4 text-accent" />}</DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={project.documents.length === 1} onSelect={() => void deleteDocument(item.id)} className="text-danger focus:bg-danger-subtle focus:text-danger"><Trash2 className="size-4" />Apagar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
            {extensionRuntime['lab.media-sound'] && <SoundBinderFooter />}
          </aside>
        )}

        <main className="writing-stage flex min-w-0 flex-1 flex-col">
          {initialView === 'editor' ? <>
          <div ref={scrollRef} onScroll={() => setFormatSelection(null)} className={cn('writing-stage-scroll min-h-0 flex-1 overflow-y-auto', typewriterMode && 'scroll-smooth')}>
            <div className={cn('mx-auto w-full px-3 pt-24 sm:px-8', distractionFree ? 'max-w-[76rem] pt-10' : 'max-w-[80rem]')}>
              <article
                className={cn(
                  'writing-paper relative mx-auto pb-4 pt-10 transition-[width,min-height,padding]',
                  distractionFree && 'writing-paper-focus max-w-manuscript',
                  wideMargins ? 'px-8 sm:px-20' : 'px-6 sm:px-12 lg:px-16',
                  pagePreset !== 'continuous' && 'writing-page-preview',
                )}
                style={{
                  width: `min(100%, ${currentPagePreset.width})`,
                  minHeight: currentPagePreset.minHeight,
                  '--writing-page-height': currentPagePreset.pageHeight ? `${currentPagePreset.pageHeight}px` : undefined,
                } as React.CSSProperties}
              >
                {formatSelection && !distractionFree && <div className="fixed z-[80] -translate-x-1/2" style={{ left: formatSelection.left, top: formatSelection.top }}>
                  <div className="workspace-scrollbar flex w-max max-w-[calc(100vw-1.5rem)] items-center gap-1.5 overflow-x-auto rounded-2xl border border-line-strong bg-surface p-1.5 shadow-floating" aria-label="Formatação do texto">
                    <div className="flex items-center gap-0.5" role="group" aria-label="Histórico">
                      <ToolbarButton comfortable label="Desfazer" shortcut="Ctrl Z" onClick={() => runCommand('undo')}><Undo2 /></ToolbarButton>
                      <ToolbarButton comfortable label="Refazer" shortcut="Ctrl Y" onClick={() => runCommand('redo')}><Redo2 /></ToolbarButton>
                    </div>
                    <span className="h-7 w-px shrink-0 bg-line-strong" aria-hidden="true" />
                    <div className="flex items-center gap-0.5" role="group" aria-label="Estilo do texto">
                      <ToolbarButton comfortable label="Negrito" shortcut="Ctrl B" onClick={() => runCommand('bold')}><Bold /></ToolbarButton>
                      <ToolbarButton comfortable label="Itálico" shortcut="Ctrl I" onClick={() => runCommand('italic')}><Italic /></ToolbarButton>
                      <ToolbarButton comfortable label="Sublinhado" shortcut="Ctrl U" onClick={() => runCommand('underline')}><Underline /></ToolbarButton>
                    </div>
                    <span className="h-7 w-px shrink-0 bg-line-strong" aria-hidden="true" />
                    <div className="flex items-center gap-0.5" role="group" aria-label="Estrutura do texto">
                      <ToolbarButton comfortable label="Corpo do texto" onClick={() => runCommand('formatBlock', 'p')}><AlignLeft /></ToolbarButton>
                      <ToolbarButton comfortable label="Título de cena" onClick={() => runCommand('formatBlock', 'h2')}><Heading2 /></ToolbarButton>
                      <ToolbarButton comfortable label="Citação em bloco" onClick={() => runCommand('formatBlock', 'blockquote')}><Quote /></ToolbarButton>
                      <ToolbarButton comfortable label="Inserir quebra de cena" onClick={() => runCommand('insertHTML', '<p class="scene-break">* * *</p><p><br></p>')}><SeparatorHorizontal /></ToolbarButton>
                    </div>
                  </div>
                </div>}
                <div className="mb-10 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-accent"><span>{kindLabels[activeDocument.kind]} · {String(activeDocument.position + 1).padStart(2, '0')}</span><span className="text-muted">{statusLabels[activeDocument.status]}</span></div>
                <label htmlFor="writing-document-title" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Título do capítulo</label>
                <input
                  id="writing-document-title"
                  value={activeDocument.title}
                  onChange={(event) => updateActiveDocument({ title: event.target.value })}
                  aria-label="Título do capítulo"
                  className="mb-6 w-full border-0 bg-transparent font-serif text-3xl font-semibold leading-tight text-ink outline-none placeholder:text-muted sm:text-4xl"
                  placeholder="Título do capítulo"
                />
                <div className="mb-8 h-px bg-gradient-to-r from-line via-line to-transparent" />
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onKeyDown={handleEditorKeyDown}
                  onClick={handleEditorClick}
                  onBlur={() => window.setTimeout(() => {
                    setFormatSelection(null);
                    setMentionQuery(null);
                  }, 160)}
                  role="textbox"
                  aria-multiline="true"
                  aria-label={`Texto de ${activeDocument.title}`}
                  data-empty={editorEmpty}
                  data-mention-style={mentionSettings.appearance}
                  data-placeholder="Comece a escrever sua história aqui."
                  spellCheck
                  className={cn('writing-editor max-w-manuscript font-serif text-editor text-ink outline-none', paragraphIndent && 'writing-editor-indent', `writing-editor-spacing-${paragraphSpacing}`)}
                />
                {mentionQuery !== null && <div className={cn('fixed z-[70] overflow-hidden rounded-card border border-line-strong bg-surface shadow-floating', mentionSettings.suggestionView === 'rich' ? 'w-[min(25rem,calc(100vw-1.5rem))]' : 'w-72')} style={mentionPosition} role="listbox" aria-label="Referenciar item da Enciclopédia">
                  <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2"><span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-accent"><AtSign className="size-3.5" />Contexto da Enciclopédia</span><span className="text-[10px] text-muted">{mentionSettings.groupByType ? 'Por relevância e tipo' : 'Por relevância'}</span></div>
                  {mentionMatches.length ? mentionMatches.map((entry, index) => <button key={entry.id} type="button" role="option" aria-selected={mentionIndex === index} onMouseDown={(event) => event.preventDefault()} onClick={() => insertEntityMention(entry)} onMouseEnter={() => setMentionIndex(index)} className={cn('flex w-full items-start gap-3 px-3 py-2.5 text-left', mentionIndex === index ? 'bg-accent-subtle' : 'hover:bg-surface-muted')}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-xs font-semibold text-accent">@</span>
                    <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="block truncate text-sm font-semibold text-ink">{entry.name}</span>{mentionSettings.showCanonStatus && <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase', entry.status === 'canon' ? 'bg-success-subtle text-success' : 'bg-surface-muted text-muted')}>{entry.status === 'canon' ? 'Cânone' : 'Rascunho'}</span>}{mentionSettings.warnSpoilers && entry.isSpoiler && <span className="shrink-0 rounded-full bg-warning-subtle px-1.5 py-0.5 text-[9px] font-semibold text-warning">Spoiler</span>}</span><span className="mt-0.5 block truncate text-[11px] text-muted">{encyclopediaTypeLabels[entry.type]}{mentionSettings.searchAliases && entry.aliases.length ? ` · ${entry.aliases.slice(0, 2).join(', ')}` : ''}</span>{mentionSettings.suggestionView === 'rich' && entry.summary && <span className="mt-1.5 block line-clamp-2 text-xs leading-relaxed text-muted">{entry.summary}</span>}</span>
                  </button>) : <div className="px-4 py-5 text-center"><p className="text-sm font-medium text-ink">Nenhuma referência encontrada</p><Link href={`/write/encyclopedia?work=${project.id}`} className="mt-2 inline-flex text-xs font-medium text-accent hover:underline">Criar na Enciclopédia</Link></div>}
                  <div className="border-t border-line px-3 py-2 text-[10px] text-muted">↑↓ navegar · Enter inserir · Esc fechar</div>
                </div>}
              </article>
            </div>
          </div>

          </> : initialView === 'encyclopedia' ? (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
              <EncyclopediaView entries={project.encyclopediaEntries} workTitle={project.title} persistence={project.encyclopediaPersistence} worldbuildingProfile={project.worldbuildingProfile} onSave={saveEncyclopediaEntry} onDelete={deleteEncyclopediaEntry} onSaveWorldbuilding={saveWorldbuildingProfile} />
            </div>
          ) : (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
              <WritingCollection view={initialView} documents={project.documents} onCreate={createDocument} onOpen={selectDocument} />
            </div>
          )}
          {!distractionFree && initialView !== 'encyclopedia' && <footer className="writing-dock" aria-label="Barra de ferramentas da escrita">
            <div className="workspace-scrollbar flex min-h-12 items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-control px-2 text-xs font-semibold text-ink hover:bg-surface-muted" aria-label="Abrir áreas de escrita"><LayoutList className="size-4 text-accent" /><span className="hidden sm:inline">{initialView === 'editor' ? 'Editor' : initialView === 'chapters' ? 'Capítulos' : initialView === 'scenes' ? 'Cenas' : initialView === 'notes' ? 'Notas' : 'Enciclopédia'}</span><ChevronDown className="size-3" /></DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {([['editor', 'Editor'], ['chapters', 'Capítulos'], ['scenes', 'Cenas'], ['notes', 'Notas'], ['encyclopedia', 'Enciclopédia']] as const).map(([view, label]) => <DropdownMenuItem key={view} asChild><Link href={`/write/${view}?work=${project.id}`} aria-current={initialView === view ? 'page' : undefined}>{label}{initialView === view && <Check className="ml-auto size-3.5 text-accent" />}</Link></DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="mx-0.5 h-6 w-px shrink-0 bg-line" aria-hidden="true" />
              <ToolbarButton label="Novo capítulo" shortcut="Ctrl N" onClick={() => createDocument('chapter')}><FilePlus2 className="size-4" /></ToolbarButton>
              <ToolbarButton label="Salvar agora" shortcut="Ctrl S" onClick={saveNow}><Save className="size-4" /></ToolbarButton>
              <span className="mx-0.5 h-6 w-px shrink-0 bg-line" aria-hidden="true" />
              {initialView === 'editor' && <ToolbarButton label={showBinder ? 'Ocultar estrutura' : 'Mostrar estrutura'} active={showBinder} onClick={toggleBinder}>{showBinder ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}</ToolbarButton>}
              {initialView === 'editor' && <ToolbarButton label={showInspector ? 'Ocultar inspetor' : 'Mostrar inspetor'} active={showInspector} onClick={toggleInspector}>{showInspector ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}</ToolbarButton>}
              {initialView === 'editor' && <DropdownMenu><DropdownMenuTrigger className="flex min-h-8 items-center gap-1 rounded-control px-2 text-xs text-muted hover:bg-accent-subtle hover:text-accent" aria-label="Visualização de páginas"><BookOpenText className="size-4" /><span className="hidden md:inline">{currentPagePreset.label}</span><ChevronDown className="size-3" /></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuRadioGroup value={pagePreset} onValueChange={(value) => setPagePreset(value as PagePreset)}>{(Object.entries(pagePresets) as Array<[PagePreset, { label: string }]>).map(([preset, option]) => <DropdownMenuRadioItem key={preset} value={preset}>{option.label}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>}
              {initialView === 'editor' && extensionRuntime['lab.immersive-focus'] && <ToolbarButton label="Modo foco" shortcut="Ctrl Shift F" onClick={() => setDistractionFree(true)}><Focus className="size-4" /></ToolbarButton>}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex size-8 shrink-0 items-center justify-center rounded-control text-muted hover:bg-accent-subtle hover:text-accent" aria-label="Mais ações de escrita" title="Mais ações"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Ações da obra</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => void createSnapshot()}><Camera className="size-4" />Criar instantâneo</DropdownMenuItem>
                  <DropdownMenuItem onSelect={exportMarkdown}><Download className="size-4" />Exportar Markdown</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={wideMargins} onCheckedChange={setWideMargins}>Margens amplas</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={paragraphIndent} onCheckedChange={setParagraphIndent}>Recuo de parágrafo</DropdownMenuCheckboxItem>
                  <DropdownMenuSub><DropdownMenuSubTrigger><AlignLeft className="size-4" />Espaço entre parágrafos</DropdownMenuSubTrigger><DropdownMenuSubContent><DropdownMenuRadioGroup value={paragraphSpacing} onValueChange={(value) => setParagraphSpacing(value as ParagraphSpacing)}><DropdownMenuRadioItem value="compact">Compacto</DropdownMenuRadioItem><DropdownMenuRadioItem value="book">Livro</DropdownMenuRadioItem><DropdownMenuRadioItem value="airy">Arejado</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuSubContent></DropdownMenuSub>
                  {extensionRuntime['lab.typewriter-mode'] && <><DropdownMenuSeparator /><DropdownMenuCheckboxItem checked={typewriterMode} onCheckedChange={setTypewriterMode}>Modo máquina de escrever</DropdownMenuCheckboxItem></>}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="mx-0.5 h-6 w-px shrink-0 bg-line" aria-hidden="true" />
              <span className={cn('flex shrink-0 items-center gap-1 px-1 text-[11px] text-muted', saveState === 'error' || saveState === 'offline' ? 'text-danger' : undefined)} role="status" title={saveLabel} aria-label={saveLabel}>{saveState === 'saving' ? <Cloud className="size-3.5 animate-pulse" /> : <Check className="size-3.5" />}<span className="hidden lg:inline">{saveState === 'saving' ? 'Salvando' : saveState === 'offline' ? 'Pendente' : saveState === 'error' ? 'Não salvo' : 'Salvo'}</span></span>
            </div>
            {initialView === 'editor' && extensionRuntime['lab.manuscript-metrics'] && <div className="workspace-scrollbar flex min-h-8 items-center gap-3 overflow-x-auto border-t border-line px-3 text-[11px] text-muted sm:px-4">
              <span className="shrink-0 font-medium text-ink">{wordCount.toLocaleString('pt-BR')} palavras</span>
              <span className="hidden shrink-0 sm:inline">{characterCount.toLocaleString('pt-BR')} caracteres</span>
              {extensionRuntime['lab.context-mentions'] && mentionSettings.enabled && mentionSettings.showCounts && mentionStats.total > 0 && <span className="hidden shrink-0 md:inline">{mentionStats.total.toLocaleString('pt-BR')} {mentionStats.total === 1 ? 'referência' : 'referências'} · {mentionStats.unique.toLocaleString('pt-BR')} {mentionStats.unique === 1 ? 'entidade' : 'entidades'}</span>}
              <span className="hidden shrink-0 sm:inline">Meta: {activeDocument.goal.toLocaleString('pt-BR')}</span>
              {wordCount > 0 && activeDocument.goal > 0 && <div className="hidden h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-line sm:block" aria-label={`${progress}% da meta do capítulo`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className={cn('block h-full rounded-full transition-[width]', progress < 10 ? 'bg-line-strong' : 'bg-accent')} style={{ width: `${Math.max(progress, 2)}%` }} /></div>}
              {pagePreset !== 'continuous' && <span className="hidden shrink-0 lg:inline">{pageCount} {pageCount === 1 ? 'página' : 'páginas'}</span>}
            </div>}
          </footer>}
        </main>

        {!distractionFree && showInspector && initialView === 'editor' && (
          <aside className="writing-inspector absolute inset-y-0 right-0 z-30 flex w-[18rem] shrink-0 flex-col border-l shadow-floating xl:static xl:shadow-none" aria-label="Inspetor do documento">
            <div className="border-b border-line px-5 pb-5 pt-20 xl:pt-7"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Ficha de escrita</p><button type="button" onClick={toggleInspector} className="flex size-7 items-center justify-center rounded-control text-muted hover:bg-surface-muted xl:hidden" aria-label="Fechar inspetor"><X className="size-4" /></button></div><h2 className="mt-2 truncate font-serif text-lg font-semibold text-ink">{activeDocument.title}</h2><p className="mt-1 text-[11px] text-muted">{statusLabels[activeDocument.status]} · {kindLabels[activeDocument.kind]}</p></div>
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-28 pt-4">
              <section className="mb-3 rounded-2xl border border-accent/20 bg-accent-subtle p-4" aria-live="polite">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Ritmo deste capítulo</p>
                <div className="mt-3"><strong className="block font-serif text-2xl leading-tight text-ink">{wordCount === 0 ? 'Pronto para começar' : activeDocument.goal > 0 ? `${progress}%` : `${wordCount} palavras`}</strong><span className="mt-1 block text-[11px] leading-snug text-muted">{wordCount > 0 ? activeDocument.goal > 0 ? `${wordCount.toLocaleString('pt-BR')} de ${activeDocument.goal.toLocaleString('pt-BR')} palavras` : 'Sem meta definida' : activeDocument.goal > 0 ? `${activeDocument.goal.toLocaleString('pt-BR')} palavras como referência` : 'Meta opcional'}</span></div>
                {wordCount > 0 && activeDocument.goal > 0 && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><span className={cn('block h-full rounded-full transition-[width]', progress < 10 ? 'bg-line-strong' : 'bg-accent')} style={{ width: `${Math.max(progress, 2)}%` }} /></div>}
                <p className="mt-4 text-[11px] leading-relaxed text-muted">A meta orienta o caminho. O texto encontra o próprio ritmo.</p>
              </section>
              {selectedEntity && <section className="mb-3 rounded-card border border-accent/25 bg-accent-subtle p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Contexto vinculado</p><h3 className="mt-1 font-serif text-lg font-semibold text-ink">{selectedEntity.name}</h3><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">{encyclopediaTypeLabels[selectedEntity.type]}</p></div><button type="button" onClick={() => setSelectedEntityId(null)} className="flex size-7 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface hover:text-ink" aria-label="Fechar contexto"><X className="size-3.5" /></button></div>
                <p className="mt-3 text-xs leading-relaxed text-muted">{selectedEntity.summary || 'Esta entrada ainda não tem um resumo contextual.'}</p>
                {mentionSettings.showMetadata && <div className="mt-3 border-t border-accent/15 pt-3 text-[11px] leading-relaxed text-muted">
                  {selectedEntity.aliases.length > 0 && <p><span className="font-medium text-ink">Aliases:</span> {selectedEntity.aliases.join(', ')}</p>}
                  <p className={selectedEntity.aliases.length > 0 ? 'mt-1' : undefined}><span className="font-medium text-ink">Atualizada:</span> {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(selectedEntity.updatedAt))}</p>
                  <p className="mt-1"><span className="font-medium text-ink">ID:</span> <span className="font-mono">{selectedEntity.id.slice(0, 8)}</span></p>
                </div>}
                <Link href={`/write/encyclopedia?work=${project.id}`} className="mt-3 inline-flex text-xs font-medium text-accent hover:underline">Abrir na Enciclopédia</Link>
              </section>}
              {extensionRuntime['lab.reference-guardian'] && mentionSettings.enabled && (mentionSettings.showCounts || mentionSettings.verifyReferences) && <section className="mb-3 rounded-card border border-line bg-surface p-4" aria-labelledby="mention-analysis-title">
                <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Extensão @</p><h3 id="mention-analysis-title" className="mt-0.5 text-sm font-semibold text-ink">Referências do capítulo</h3></div>{mentionSettings.verifyReferences && (mentionStats.broken > 0 ? <AlertTriangle className="size-4 text-warning" /> : <ShieldCheck className="size-4 text-success" />)}</div>
                {mentionSettings.showCounts && <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-control bg-surface-muted px-2 py-3"><strong className="block font-serif text-xl text-ink">{mentionStats.total}</strong><span className="text-[10px] text-muted">Citações</span></div><div className="rounded-control bg-surface-muted px-2 py-3"><strong className="block font-serif text-xl text-ink">{mentionStats.unique}</strong><span className="text-[10px] text-muted">Entidades</span></div><div className="rounded-control bg-surface-muted px-2 py-3"><strong className={cn('block font-serif text-xl', mentionStats.broken ? 'text-warning' : 'text-success')}>{mentionStats.broken}</strong><span className="text-[10px] text-muted">Quebradas</span></div></div>}
                {mentionSettings.showCounts && Object.keys(mentionStats.byType).length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{(Object.entries(mentionStats.byType) as Array<[EncyclopediaEntry['type'], number]>).map(([type, count]) => <span key={type} className="rounded-full border border-line bg-editor px-2 py-1 text-[10px] text-muted"><span className="font-medium text-ink">{encyclopediaTypeLabels[type]}</span> · {count}</span>)}</div>}
                {mentionSettings.verifyReferences && <div className={cn('mt-3 flex items-start gap-2 rounded-control px-3 py-2 text-[11px] leading-relaxed', mentionStats.broken ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success')}>{mentionStats.broken ? <><AlertTriangle className="mt-0.5 size-3.5 shrink-0" /><span>{mentionStats.broken} {mentionStats.broken === 1 ? 'referência aponta' : 'referências apontam'} para uma entrada removida. Passe o cursor sobre o texto sublinhado para localizar.</span></> : <><ShieldCheck className="mt-0.5 size-3.5 shrink-0" /><span>{mentionStats.total ? 'Todos os vínculos estão íntegros.' : 'Nenhuma referência para verificar neste capítulo.'}</span></>}</div>}
              </section>}
              <section className="mb-3 rounded-xl border border-line bg-surface p-4" aria-label="Dados do documento">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Visão rápida</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-surface-muted p-3"><strong className="block font-serif text-lg text-ink">{wordCount.toLocaleString('pt-BR')}</strong><span className="text-muted">Palavras</span></div><div className="rounded-lg bg-surface-muted p-3"><strong className="block font-serif text-lg text-ink">{wordCount ? Math.max(1, Math.ceil(wordCount / 220)) : 0} min</strong><span className="text-muted">Leitura estimada</span></div></div>
                <p className="mt-3 text-[11px] text-muted">{characterCount.toLocaleString('pt-BR')} caracteres · Atualizado em {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(activeDocument.updatedAt))}</p>
              </section>
              <section className="mb-3 rounded-xl border border-line bg-surface p-4" aria-label="Ações do capítulo">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Ações do capítulo</p>
                <div className="mt-3 grid gap-1">
                  <button type="button" onClick={() => void createSnapshot()} className="flex min-h-9 items-center gap-2 rounded-lg px-2 text-left text-xs text-ink hover:bg-surface-muted"><Camera className="size-3.5 text-accent" />Criar instantâneo</button>
                  <button type="button" onClick={exportMarkdown} className="flex min-h-9 items-center gap-2 rounded-lg px-2 text-left text-xs text-ink hover:bg-surface-muted"><Download className="size-3.5 text-accent" />Exportar Markdown</button>
                  <Link href={`/write/encyclopedia?work=${project.id}`} className="flex min-h-9 items-center gap-2 rounded-lg px-2 text-left text-xs text-ink hover:bg-surface-muted"><BookOpenText className="size-3.5 text-accent" />Abrir Enciclopédia</Link>
                </div>
              </section>
              <details className="group mt-3 rounded-xl border border-line bg-surface p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-ink">Sinopse <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /></summary>
                <textarea id="document-synopsis" aria-label="Sinopse" value={activeDocument.synopsis} onChange={(event) => updateActiveDocument({ synopsis: event.target.value })} rows={5} placeholder="Resuma o que acontece neste capítulo." className="mt-3 w-full resize-none rounded-control border border-line bg-editor px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent" />
              </details>
              <details className="group mt-2 rounded-xl border border-line bg-surface p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-ink">Configurações <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /></summary>
                <div className="mt-4 space-y-4"><div><label htmlFor="document-status" className="text-xs text-muted">Status</label><select id="document-status" value={activeDocument.status} onChange={(event) => updateActiveDocument({ status: event.target.value as WritingDocumentStatus })} className="mt-2 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink"><option value="draft">Rascunho</option><option value="review">Em revisão</option><option value="final">Final</option></select></div><div><label htmlFor="document-goal" className="text-xs text-muted">Meta de palavras</label><input id="document-goal" type="number" min={0} step={100} value={activeDocument.goal} onChange={(event) => updateActiveDocument({ goal: Math.max(0, Number(event.target.value)) })} className="mt-2 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink" /></div></div>
              </details>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
