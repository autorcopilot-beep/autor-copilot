import type { Enums } from '@/types/database.generated';

export type LibraryView = 'all' | 'recent' | 'favorites' | 'archived' | 'catalogs';
export type LibraryWorkStatus = Enums<'library_work_status'>;

export type LibraryWork = {
  id: string;
  title: string;
  subtitle: string;
  synopsis: string;
  genre: string;
  status: LibraryWorkStatus;
  isFavorite: boolean;
  isPrimary: boolean;
  archivedAt: string | null;
  wordGoal: number;
  coverTone: string;
  documentCount: number;
  wordCount: number;
  catalogIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type LibraryCatalog = {
  id: string;
  name: string;
  description: string;
  color: string;
  workCount: number;
};

export const libraryViews: LibraryView[] = ['all', 'recent', 'favorites', 'archived', 'catalogs'];

export function isLibraryView(value: string): value is LibraryView {
  return libraryViews.includes(value as LibraryView);
}

export const workStatusLabels: Record<LibraryWorkStatus, string> = {
  planning: 'Planejamento',
  drafting: 'Em escrita',
  revising: 'Em revisão',
  complete: 'Concluída',
};

