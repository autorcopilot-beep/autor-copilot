import type { Database, Enums, Json } from '@/types/database.generated';

export type WritingDocumentKind = Enums<'writing_document_kind'>;
export type WritingDocumentStatus = Enums<'writing_document_status'>;
export type EncyclopediaEntryType = Enums<'encyclopedia_entry_type'>;
export type EncyclopediaStatus = 'draft' | 'canon' | 'archived';
export type WritingView = 'editor' | 'chapters' | 'scenes' | 'notes' | 'encyclopedia';

export type EncyclopediaEntry = {
  id: string;
  type: EncyclopediaEntryType;
  name: string;
  aliases: string[];
  summary: string;
  details: string;
  color: string;
  status: EncyclopediaStatus;
  tags: string[];
  storyRole: string;
  appearance: string;
  history: string;
  connections: string;
  rules: string;
  isPinned: boolean;
  isSpoiler: boolean;
  profileAnswers: Record<string, string | string[] | boolean>;
  templateId: string;
  updatedAt: string;
};

export type WorldbuildingProfile = {
  methodology: 'top_down' | 'bottom_up' | 'inside_out';
  miceFocus: 'milieu' | 'idea' | 'character' | 'event';
  genres: string[];
  povMode: 'first' | 'third_limited' | 'third_omniscient' | 'multiple';
  psychicDistance: number;
  incluingEnabled: boolean;
  genreAnswers: Record<string, string | string[] | boolean>;
  loreAnswers: Record<string, string | string[] | boolean>;
};

export const defaultWorldbuildingProfile: WorldbuildingProfile = {
  methodology: 'inside_out', miceFocus: 'character', genres: [], povMode: 'third_limited',
  psychicDistance: 3, incluingEnabled: true, genreAnswers: {}, loreAnswers: {},
};

export function parseProfileAnswers(value: Json | undefined): EncyclopediaEntry['profileAnswers'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const answers: EncyclopediaEntry['profileAnswers'] = {};
  for (const [key, answer] of Object.entries(value)) {
    if (typeof answer === 'boolean' || typeof answer === 'string') answers[key] = answer;
    else if (Array.isArray(answer) && answer.every((item) => typeof item === 'string')) answers[key] = answer as string[];
  }
  return answers;
}

export function mapEncyclopediaEntry(row: Database['public']['Tables']['encyclopedia_entries']['Row']): EncyclopediaEntry {
  return {
    id: row.id,
    type: row.entry_type,
    name: row.name,
    aliases: row.aliases,
    summary: row.summary,
    details: row.details,
    color: row.color,
    status: ['draft', 'canon', 'archived'].includes(row.status) ? row.status as EncyclopediaStatus : 'draft',
    tags: row.tags ?? [],
    storyRole: row.story_role ?? '',
    appearance: row.appearance ?? '',
    history: row.history ?? '',
    connections: row.connections ?? '',
    rules: row.rules ?? '',
    isPinned: row.is_pinned ?? false,
    isSpoiler: row.is_spoiler ?? false,
    profileAnswers: parseProfileAnswers(row.profile_answers),
    templateId: row.template_id ?? '',
    updatedAt: row.updated_at,
  };
}

export type WritingDocument = {
  id: string;
  parentId: string | null;
  kind: WritingDocumentKind;
  title: string;
  contentHtml: string;
  synopsis: string;
  status: WritingDocumentStatus;
  goal: number;
  position: number;
  updatedAt: string;
};

export type WritingProject = {
  id: string;
  title: string;
  documents: WritingDocument[];
  encyclopediaEntries: EncyclopediaEntry[];
  worldbuildingProfile: WorldbuildingProfile;
  encyclopediaPersistence: 'cloud' | 'local';
  activeDocumentId: string;
  updatedAt: string;
};

export const writingViews: WritingView[] = ['editor', 'chapters', 'scenes', 'notes', 'encyclopedia'];

export function isWritingView(value: string): value is WritingView {
  return writingViews.includes(value as WritingView);
}

export const kindLabels: Record<WritingDocumentKind, string> = {
  folder: 'Pasta',
  page: 'Página',
  chapter: 'Capítulo',
  scene: 'Cena',
  note: 'Nota',
  draft: 'Rascunho',
};

export const statusLabels: Record<WritingDocumentStatus, string> = {
  draft: 'Rascunho',
  review: 'Em revisão',
  final: 'Final',
};

export const encyclopediaTypeLabels: Record<EncyclopediaEntryType, string> = {
  character: 'Personagem',
  location: 'Local',
  organization: 'Organização',
  object: 'Objeto',
  concept: 'Conceito',
  event: 'Evento',
};
