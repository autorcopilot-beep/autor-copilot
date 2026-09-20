import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { renderLibrary } from '@/features/library/render-library';
import { isLibraryView } from '@/features/library/types';

export const metadata: Metadata = { title: 'Biblioteca' };

export default async function LibraryViewPage({ params, searchParams }: { params: Promise<{ view: string }>; searchParams: Promise<{ q?: string; sort?: string }> }) {
  const [{ view }, query] = await Promise.all([params, searchParams]);
  if (!isLibraryView(view) || view === 'catalogs') notFound();
  return renderLibrary(view, query);
}

