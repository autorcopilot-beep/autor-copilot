import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { WritingStudio } from '@/features/writing/components/writing-studio';
import { loadWritingProject } from '@/features/writing/server';
import { isWritingView } from '@/features/writing/types';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Ambiente de escrita',
  description: 'Editor, capítulos, cenas e notas do manuscrito.',
};

export default async function WritingViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ view: string }>;
  searchParams: Promise<{ document?: string; work?: string }>;
}) {
  const [{ view }, query] = await Promise.all([params, searchParams]);
  if (!isWritingView(view)) notFound();

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    const nextParams = new URLSearchParams();
    if (query.work) nextParams.set('work', query.work);
    if (view === 'editor' && query.document) nextParams.set('document', query.document);
    const next = `/write/${view}${nextParams.size ? `?${nextParams}` : ''}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const project = await loadWritingProject(supabase, userId, query.document, query.work);

  return <WritingStudio userId={userId} initialProject={project} initialView={view} />;
}
