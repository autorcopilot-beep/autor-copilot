import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { renderOverview } from '@/features/overview/render-overview';
import { isOverviewView } from '@/features/overview/types';

export const metadata: Metadata = { title: 'Visão geral da obra' };

export default async function OverviewViewPage({ params, searchParams }: { params: Promise<{ view: string }>; searchParams: Promise<{ work?: string }> }) {
  const [{ view }, query] = await Promise.all([params, searchParams]);
  if (!isOverviewView(view)) notFound();
  return renderOverview(view, query.work);
}

