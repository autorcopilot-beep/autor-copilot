import type { Enums } from '@/types/database.generated';

export type WritingDocumentKind = Enums<'writing_document_kind'>;
export type WritingDocumentStatus = Enums<'writing_document_status'>;
export type EncyclopediaEntryType = Enums<'encyclopedia_entry_type'>;
export type WritingView = 'editor' | 'chapters' | 'scenes' | 'notes' | 'encyclopedia';

export type EncyclopediaEntry = {
  id: string;
  type: EncyclopediaEntryType;
  name: string;
  aliases: string[];
  summary: string;
  details: string;
  color: string;
  updatedAt: string;
};

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
