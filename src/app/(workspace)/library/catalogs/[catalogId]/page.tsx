import type { Metadata } from 'next';

import { renderLibrary } from '@/features/library/render-library';

export const metadata: Metadata = { title: 'Catálogo da biblioteca' };

export default async function CatalogPage({ params, searchParams }: { params: Promise<{ catalogId: string }>; searchParams: Promise<{ q?: string; sort?: string }> }) {
  const [{ catalogId }, query] = await Promise.all([params, searchParams]);
  return renderLibrary('catalogs', query, catalogId);
}

