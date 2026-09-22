import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { LibraryCatalog, LibraryView, LibraryWork } from '@/features/library/types';
import type { Database } from '@/types/database.generated';

function countWords(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
  return text ? text.split(/\s+/u).length : 0;
}

export async function loadLibrary(
  supabase: SupabaseClient<Database>,
  userId: string,
  view: LibraryView,
  options: { query?: string; sort?: string; catalogId?: string } = {},
) {
  const [{ data: workRows, error: worksError }, { data: catalogRows, error: catalogsError }] = await Promise.all([
    supabase
      .from('works')
      .select('id, title, subtitle, synopsis, genre, status, is_favorite, is_primary, archived_at, word_goal, cover_tone, created_at, updated_at')
      .eq('owner_id', userId),
    supabase
      .from('library_catalogs')
      .select('id, name, description, color, position')
      .eq('owner_id', userId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);
  if (worksError) throw worksError;
  if (catalogsError) throw catalogsError;

  const workIds = (workRows ?? []).map((work) => work.id);
  const [{ data: documentRows, error: documentsError }, { data: membershipRows, error: membershipsError }] = await Promise.all([
    workIds.length
      ? supabase.from('writing_documents').select('work_id, content_html').eq('owner_id', userId).in('work_id', workIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('library_catalog_works').select('catalog_id, work_id').eq('owner_id', userId),
  ]);
  if (documentsError) throw documentsError;
  if (membershipsError) throw membershipsError;

  const metrics = new Map<string, { documentCount: number; wordCount: number }>();
  for (const document of documentRows ?? []) {
    const current = metrics.get(document.work_id) ?? { documentCount: 0, wordCount: 0 };
    current.documentCount += 1;
    current.wordCount += countWords(document.content_html);
    metrics.set(document.work_id, current);
  }

  const catalogIdsByWork = new Map<string, string[]>();
  const workCountByCatalog = new Map<string, number>();
  for (const membership of membershipRows ?? []) {
    catalogIdsByWork.set(membership.work_id, [...(catalogIdsByWork.get(membership.work_id) ?? []), membership.catalog_id]);
    workCountByCatalog.set(membership.catalog_id, (workCountByCatalog.get(membership.catalog_id) ?? 0) + 1);
  }

  const allWorks: LibraryWork[] = (workRows ?? []).map((work) => ({
    id: work.id,
    title: work.title,
    subtitle: work.subtitle,
    synopsis: work.synopsis,
    genre: work.genre,
    status: work.status,
    isFavorite: work.is_favorite,
    isPrimary: work.is_primary,
    archivedAt: work.archived_at,
    wordGoal: work.word_goal,
    coverTone: work.cover_tone,
    documentCount: metrics.get(work.id)?.documentCount ?? 0,
    wordCount: metrics.get(work.id)?.wordCount ?? 0,
    catalogIds: catalogIdsByWork.get(work.id) ?? [],
    createdAt: work.created_at,
    updatedAt: work.updated_at,
  }));

  const normalizedQuery = options.query?.trim().toLocaleLowerCase('pt-BR') ?? '';
  let works = allWorks.filter((work) => {
    if (view === 'archived') return Boolean(work.archivedAt);
    if (work.archivedAt) return false;
    if (view === 'favorites' && !work.isFavorite) return false;
    if (options.catalogId && !work.catalogIds.includes(options.catalogId)) return false;
    if (!normalizedQuery) return true;
    return [work.title, work.subtitle, work.synopsis, work.genre]
      .some((value) => value.toLocaleLowerCase('pt-BR').includes(normalizedQuery));
  });

  works.sort((a, b) => {
    if (options.sort === 'title') return a.title.localeCompare(b.title, 'pt-BR');
    if (options.sort === 'created') return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
  if (view === 'recent') works = works.slice(0, 12);

  const catalogs: LibraryCatalog[] = (catalogRows ?? []).map((catalog) => ({
    id: catalog.id,
    name: catalog.name,
    description: catalog.description,
    color: catalog.color,
    workCount: workCountByCatalog.get(catalog.id) ?? 0,
  }));

  return {
    works,
    allWorks,
    catalogs,
    stats: {
      active: allWorks.filter((work) => !work.archivedAt).length,
      favorites: allWorks.filter((work) => work.isFavorite && !work.archivedAt).length,
      archived: allWorks.filter((work) => work.archivedAt).length,
      words: allWorks.filter((work) => !work.archivedAt).reduce((sum, work) => sum + work.wordCount, 0),
    },
  };
}

