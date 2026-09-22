import type { Metadata } from 'next';

import { renderLibrary } from '@/features/library/render-library';

export const metadata: Metadata = { title: 'Catálogos da biblioteca' };

export default async function CatalogsPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  return renderLibrary('catalogs', await searchParams);
}

