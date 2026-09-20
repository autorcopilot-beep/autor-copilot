'use client';

import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
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
  ListTree,
  MessageSquarePlus,
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
  Settings2,
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
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui';
import {
  kindLabels,
  statusLabels,
  type WritingDocument,
  type WritingDocumentKind,
  type WritingDocumentStatus,
  type WritingProject,
  type WritingView,
} from '@/features/writing/types';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';

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

function sanitizeEditorHtml(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const allowed = new Set(['P', 'H2', 'BLOCKQUOTE', 'STRONG', 'B', 'EM', 'I', 'U', 'BR']);
  template.content.querySelectorAll('*').forEach((element) => {
    if (!allowed.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    const keepSceneBreak = element.tagName === 'P' && element.classList.contains('scene-break');
    Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
    if (keepSceneBreak) element.className = 'scene-break';
  });
  return template.innerHTML;
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
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
  view: Exclude<WritingView, 'editor'>;
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
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Meu livro</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">{config.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{config.description}</p>
        </div>
        <button type="button" onClick={() => onCreate(config.createKind)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"><Plus className="size-4" />{config.action}</button>
      </div>
      {visibleDocuments.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {visibleDocuments.map((item) => (
            <button key={item.id} type="button" onClick={() => onOpen(item.id)} className="group rounded-card border border-line bg-editor p-5 text-left shadow-soft transition-colors hover:border-accent">
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
        <div className="mt-8 rounded-card border border-dashed border-line-strong bg-editor px-6 py-12 text-center">
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
}: {
  userId: string;
  initialProject: WritingProject;
  initialView: WritingView;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const storageKey = `autor-copilot:writing-project:${userId}`;
  const snapshotKey = `${storageKey}:snapshots`;
  const editorRef = useRef<HTMLDivElement>(null);
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

  const activeDocument = useMemo(
    () => project.documents.find((item) => item.id === project.activeDocumentId) ?? project.documents[0],
    [project],
  );
  const wordCount = countWords(activeDocument.contentHtml);
  const characterCount = plainTextFromHtml(activeDocument.contentHtml).length;
  const progress = activeDocument.goal > 0 ? Math.min(100, Math.round((wordCount / activeDocument.goal) * 100)) : 0;

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
        content_html: item.contentHtml,
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
    editorRef.current.innerHTML = activeDocument.contentHtml;
    renderedDocumentRef.current = renderKey;
  }, [activeDocument.contentHtml, activeDocument.id, hydrated, project.updatedAt]);

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
    setProject((current) => ({
      ...current,
      activeDocumentId: id,
      documents: [...current.documents, nextDocument],
    }));
    router.push(`/write/editor?work=${project.id}&document=${id}`);
  }, [project.documents, project.id, router]);

  const selectDocument = useCallback((id: string) => {
    renderedDocumentRef.current = '';
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
      if (modifier && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setDistractionFree((current) => !current);
      }
      if (modifier && event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        setTypewriterMode((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [createDocument, saveNow]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-canvas text-ink">
      {!distractionFree && (
        <header className="shrink-0 border-b border-line bg-surface">
          <div className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3">
            <div className="flex min-w-0 items-center">
              <Link href="/dashboard" className="flex size-9 shrink-0 items-center justify-center rounded-control text-accent transition-colors hover:bg-accent-subtle" aria-label="Voltar à dashboard" title="Voltar à dashboard">
                <BookOpenText className="size-5" />
              </Link>
              <input
                value={project.title}
                onChange={(event) => setProject((current) => ({ ...current, title: event.target.value }))}
                aria-label="Título da obra"
                className="min-w-0 max-w-56 flex-1 bg-transparent px-2 font-serif text-sm font-semibold text-ink outline-none placeholder:text-muted"
              />
            </div>
            <Menubar className="hidden h-9 border-0 bg-transparent p-0 sm:flex">
              <MenubarMenu>
                <MenubarTrigger>Arquivo</MenubarTrigger>
                <MenubarContent className="w-64">
                  <MenubarGroup>
                    <MenubarItem onSelect={() => createDocument('chapter')}><FilePlus2 />Novo capítulo<MenubarShortcut>Ctrl N</MenubarShortcut></MenubarItem>
                    <MenubarItem onSelect={saveNow}><Save />Salvar agora<MenubarShortcut>Ctrl S</MenubarShortcut></MenubarItem>
                    <MenubarItem onSelect={() => void createSnapshot()}><Camera />Criar instantâneo</MenubarItem>
                  </MenubarGroup>
                  <MenubarSeparator />
                  <MenubarItem onSelect={exportMarkdown}><Download />Exportar capítulo em Markdown</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Editar</MenubarTrigger>
                <MenubarContent className="w-56">
                  <MenubarItem onSelect={() => runCommand('undo')}><Undo2 />Desfazer<MenubarShortcut>Ctrl Z</MenubarShortcut></MenubarItem>
                  <MenubarItem onSelect={() => runCommand('redo')}><Redo2 />Refazer<MenubarShortcut>Ctrl Y</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onSelect={() => runCommand('selectAll')}>Selecionar tudo<MenubarShortcut>Ctrl A</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Inserir</MenubarTrigger>
                <MenubarContent className="w-60">
                  <MenubarItem onSelect={() => runCommand('insertHTML', '<p class="scene-break">* * *</p><p><br></p>')}><SeparatorHorizontal />Quebra de cena</MenubarItem>
                  <MenubarItem disabled><MessageSquarePlus />Comentário<MenubarShortcut>Em breve</MenubarShortcut></MenubarItem>
                  <MenubarSub>
                    <MenubarSubTrigger><Plus />Referência</MenubarSubTrigger>
                    <MenubarSubContent className="w-56">
                      <MenubarLabel>Vínculos do projeto</MenubarLabel>
                      <MenubarItem disabled>@personagem</MenubarItem>
                      <MenubarItem disabled>@local</MenubarItem>
                      <MenubarItem disabled>@capítulo</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Formatar</MenubarTrigger>
                <MenubarContent className="w-60">
                  <MenubarItem onSelect={() => runCommand('bold')}><Bold />Negrito<MenubarShortcut>Ctrl B</MenubarShortcut></MenubarItem>
                  <MenubarItem onSelect={() => runCommand('italic')}><Italic />Itálico<MenubarShortcut>Ctrl I</MenubarShortcut></MenubarItem>
                  <MenubarItem onSelect={() => runCommand('underline')}><Underline />Sublinhado<MenubarShortcut>Ctrl U</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger><AlignLeft />Estilo do parágrafo</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onSelect={() => runCommand('formatBlock', 'p')}>Corpo</MenubarItem>
                      <MenubarItem onSelect={() => runCommand('formatBlock', 'h2')}>Título de cena</MenubarItem>
                      <MenubarItem onSelect={() => runCommand('formatBlock', 'blockquote')}>Citação</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Exibir</MenubarTrigger>
                <MenubarContent className="w-64">
                  <MenubarCheckboxItem checked={showBinder} onCheckedChange={setShowBinder}>Estrutura da obra</MenubarCheckboxItem>
                  <MenubarCheckboxItem checked={showInspector} onCheckedChange={setShowInspector}>Inspetor</MenubarCheckboxItem>
                  <MenubarSeparator />
                  <MenubarCheckboxItem checked={typewriterMode} onCheckedChange={setTypewriterMode}>Modo máquina de escrever<MenubarShortcut>Ctrl Alt T</MenubarShortcut></MenubarCheckboxItem>
                  <MenubarCheckboxItem checked={distractionFree} onCheckedChange={setDistractionFree}>Sem distrações<MenubarShortcut>Ctrl Shift F</MenubarShortcut></MenubarCheckboxItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <div className="flex min-w-0 items-center justify-end gap-1">
              <span className={cn('hidden items-center gap-1.5 truncate text-[11px] xl:flex', saveState === 'error' || saveState === 'offline' ? 'text-danger' : 'text-muted')} role="status">
                {saveState === 'saving' ? <Cloud className="size-3.5 animate-pulse" /> : <Check className="size-3.5" />}
                {saveState === 'saving' ? 'Salvando…' : saveState === 'offline' ? 'Salvo localmente · nuvem pendente' : saveState === 'error' ? 'Falha ao salvar' : 'Salvo localmente e na nuvem'}
              </span>
              <ToolbarButton label={showBinder ? 'Ocultar estrutura' : 'Mostrar estrutura'} onClick={toggleBinder}>
                {showBinder ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
              </ToolbarButton>
              <ToolbarButton label={showInspector ? 'Ocultar inspetor' : 'Mostrar inspetor'} onClick={toggleInspector}>
                {showInspector ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
              </ToolbarButton>
              <ToolbarButton label="Modo sem distrações" shortcut="Ctrl Shift F" onClick={() => setDistractionFree(true)}>
                <Focus className="size-4" />
              </ToolbarButton>
            </div>
          </div>

          <nav className="flex min-h-9 items-center justify-center gap-1 overflow-x-auto border-t border-line px-3" aria-label="Áreas de escrita">
            {([
              ['editor', 'Editor'],
              ['chapters', 'Capítulos'],
              ['scenes', 'Cenas'],
              ['notes', 'Notas'],
            ] as const).map(([view, label]) => (
              <Link key={view} href={`/write/${view}?work=${project.id}`} className={cn('inline-flex min-h-8 items-center rounded-control px-3 text-xs font-medium transition-colors', initialView === view ? 'bg-accent-subtle text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink')}>{label}</Link>
            ))}
          </nav>

          {initialView === 'editor' && <div className="flex min-h-10 items-center justify-center gap-1 overflow-x-auto border-t border-line px-3">
            <ToolbarButton label="Desfazer" shortcut="Ctrl Z" onClick={() => runCommand('undo')}><Undo2 className="size-4" /></ToolbarButton>
            <ToolbarButton label="Refazer" shortcut="Ctrl Y" onClick={() => runCommand('redo')}><Redo2 className="size-4" /></ToolbarButton>
            <span className="mx-1 h-5 w-px bg-line" />
            <ToolbarButton label="Negrito" shortcut="Ctrl B" onClick={() => runCommand('bold')}><Bold className="size-4" /></ToolbarButton>
            <ToolbarButton label="Itálico" shortcut="Ctrl I" onClick={() => runCommand('italic')}><Italic className="size-4" /></ToolbarButton>
            <ToolbarButton label="Sublinhado" shortcut="Ctrl U" onClick={() => runCommand('underline')}><Underline className="size-4" /></ToolbarButton>
            <span className="mx-1 h-5 w-px bg-line" />
            <ToolbarButton label="Corpo do texto" onClick={() => runCommand('formatBlock', 'p')}><AlignLeft className="size-4" /></ToolbarButton>
            <ToolbarButton label="Título de cena" onClick={() => runCommand('formatBlock', 'h2')}><Heading2 className="size-4" /></ToolbarButton>
            <ToolbarButton label="Citação" onClick={() => runCommand('formatBlock', 'blockquote')}><Quote className="size-4" /></ToolbarButton>
            <ToolbarButton label="Quebra de cena" onClick={() => runCommand('insertHTML', '<p class="scene-break">* * *</p><p><br></p>')}><SeparatorHorizontal className="size-4" /></ToolbarButton>
          </div>}
        </header>
      )}

      {distractionFree && (
        <button type="button" onClick={() => setDistractionFree(false)} className="fixed right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full border border-line bg-surface/90 text-muted shadow-soft backdrop-blur-sm hover:text-ink" aria-label="Sair do modo sem distrações" title="Sair do modo sem distrações">
          <X className="size-4" />
        </button>
      )}

      <div className="relative flex min-h-0 flex-1">
        {!distractionFree && showBinder && (
          <aside className="absolute inset-y-0 left-0 z-30 flex w-[18rem] shrink-0 flex-col border-r border-line bg-surface shadow-floating lg:static lg:shadow-none" aria-label="Estrutura da obra">
            <div className="flex min-h-12 items-center justify-between border-b border-line px-4">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Manuscrito</p><h2 className="font-serif text-sm font-semibold">Estrutura da obra</h2></div>
              <button type="button" onClick={() => createDocument('chapter')} className="flex size-8 items-center justify-center rounded-control text-muted hover:bg-accent-subtle hover:text-accent" aria-label="Novo capítulo" title="Novo capítulo"><Plus className="size-4" /></button>
            </div>
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
              <div className="mb-1 flex min-h-9 items-center gap-2 rounded-control px-2 text-xs font-semibold text-ink"><ChevronDown className="size-3.5 text-muted" /><ListTree className="size-4 text-accent" />Manuscrito</div>
              <div className="ml-3 space-y-0.5 border-l border-line pl-2">
                {project.documents.slice().sort((a, b) => a.position - b.position).map((item, index) => (
                  <div key={item.id} className={cn('group flex min-h-10 items-center rounded-control transition-colors', item.id === activeDocument.id ? 'bg-accent-subtle text-accent' : 'text-muted hover:bg-surface-muted hover:text-ink')}>
                    <button type="button" onClick={() => selectDocument(item.id)} className="flex min-h-10 min-w-0 flex-1 items-center gap-2 px-2 text-left text-sm">
                      <FileText className="size-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      <span className="text-[9px] uppercase tracking-wide opacity-65">{kindLabels[item.kind]}</span>
                      <span className="text-[10px] tabular-nums opacity-70">{countWords(item.contentHtml)}</span>
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
            <div className="border-t border-line px-4 py-3 text-[11px] leading-relaxed text-muted">
              Use o menu de cada item para mover, categorizar ou apagar.
            </div>
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col bg-canvas">
          {initialView === 'editor' ? <>
          <div ref={scrollRef} className={cn('workspace-scrollbar min-h-0 flex-1 overflow-y-auto', typewriterMode && 'scroll-smooth')}>
            <div className={cn('mx-auto min-h-full w-full px-4 py-8 sm:px-8 lg:py-12', distractionFree ? 'max-w-[76rem]' : 'max-w-[72rem]')}>
              <article className={cn('mx-auto min-h-[calc(100dvh-12rem)] bg-editor px-6 py-10 shadow-soft sm:px-12 lg:px-16', distractionFree ? 'max-w-manuscript border-0 bg-transparent shadow-none' : 'max-w-[54rem] border border-line')}>
                <input
                  value={activeDocument.title}
                  onChange={(event) => updateActiveDocument({ title: event.target.value })}
                  aria-label="Título do capítulo"
                  className="mb-8 w-full border-0 bg-transparent font-serif text-3xl font-semibold leading-tight text-ink outline-none placeholder:text-muted sm:text-4xl"
                  placeholder="Título do capítulo"
                />
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncEditorState}
                  role="textbox"
                  aria-multiline="true"
                  aria-label={`Texto de ${activeDocument.title}`}
                  data-placeholder="Escreva a primeira linha…"
                  spellCheck
                  className="writing-editor min-h-[60vh] max-w-manuscript font-serif text-editor text-ink outline-none"
                />
              </article>
            </div>
          </div>

          <footer className="flex min-h-9 shrink-0 items-center gap-3 border-t border-line bg-surface px-3 text-[11px] text-muted sm:px-4">
            <span className="font-medium text-ink">{wordCount.toLocaleString('pt-BR')} palavras</span>
            <span>{characterCount.toLocaleString('pt-BR')} caracteres</span>
            <span className="hidden sm:inline">Meta: {activeDocument.goal.toLocaleString('pt-BR')}</span>
            <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-line sm:block" aria-label={`${progress}% da meta do capítulo`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className="block h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress}%` }} /></div>
            <span className="ml-auto inline-flex items-center gap-1.5"><span className={cn('size-1.5 rounded-full', saveState === 'error' || saveState === 'offline' ? 'bg-danger' : saveState === 'saving' ? 'bg-warning' : 'bg-success')} />{saveState === 'saving' ? 'Salvando' : saveState === 'offline' ? 'Local salvo · nuvem pendente' : saveState === 'error' ? 'Não salvo' : 'Local e nuvem protegidos'}</span>
          </footer>
          </> : (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
              <WritingCollection view={initialView} documents={project.documents} onCreate={createDocument} onOpen={selectDocument} />
            </div>
          )}
        </main>

        {!distractionFree && showInspector && initialView === 'editor' && (
          <aside className="absolute inset-y-0 right-0 z-30 flex w-[19rem] shrink-0 flex-col border-l border-line bg-surface shadow-floating xl:static xl:shadow-none" aria-label="Inspetor do documento">
            <div className="flex min-h-12 items-center gap-2 border-b border-line px-4"><Settings2 className="size-4 text-accent" /><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Documento</p><h2 className="font-serif text-sm font-semibold">Inspetor</h2></div></div>
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
              <section className="border-b border-line p-4">
                <label htmlFor="document-synopsis" className="text-xs font-semibold text-ink">Sinopse</label>
                <textarea id="document-synopsis" value={activeDocument.synopsis} onChange={(event) => updateActiveDocument({ synopsis: event.target.value })} rows={6} placeholder="Resuma o que acontece neste capítulo." className="mt-2 w-full resize-none rounded-control border border-line bg-editor px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-focus/20" />
              </section>
              <section className="space-y-4 border-b border-line p-4">
                <div>
                  <label htmlFor="document-status" className="text-xs font-semibold text-ink">Status</label>
                  <select id="document-status" value={activeDocument.status} onChange={(event) => updateActiveDocument({ status: event.target.value as WritingDocumentStatus })} className="mt-2 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-focus/20">
                    <option value="draft">Rascunho</option><option value="review">Em revisão</option><option value="final">Final</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="document-goal" className="text-xs font-semibold text-ink">Meta de palavras</label>
                  <input id="document-goal" type="number" min={0} step={100} value={activeDocument.goal} onChange={(event) => updateActiveDocument({ goal: Math.max(0, Number(event.target.value)) })} className="mt-2 min-h-10 w-full rounded-control border border-line bg-editor px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-focus/20" />
                </div>
              </section>
              <section className="p-4">
                <p className="text-xs font-semibold text-ink">Progresso do capítulo</p>
                <div className="mt-3 flex items-end justify-between"><strong className="font-serif text-2xl text-ink">{progress}%</strong><span className="text-[11px] text-muted">{wordCount} de {activeDocument.goal}</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress}%` }} /></div>
                <p className="mt-4 text-xs leading-relaxed text-muted">O progresso existe para orientar. Ele não reduz a qualidade do seu dia de escrita a um número.</p>
              </section>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
