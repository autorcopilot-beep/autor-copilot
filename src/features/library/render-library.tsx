import { notFound, redirect } from 'next/navigation';

import { LibraryPage } from '@/features/library/components/library-page';
import { loadLibrary } from '@/features/library/server';
import type { LibraryView } from '@/features/library/types';
import { createClient } from '@/lib/supabase/server';

export async function renderLibrary(view: LibraryView, query: { q?: string; sort?: string }, catalogId?: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect('/login?next=/library/all');
  const library = await loadLibrary(supabase, userId, view, { query: query.q, sort: query.sort, catalogId });
  if (catalogId && !library.catalogs.some((catalog) => catalog.id === catalogId)) notFound();
  return <LibraryPage view={view} {...library} query={query.q} sort={query.sort} catalogId={catalogId} />;
}

