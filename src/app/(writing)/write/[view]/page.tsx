import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { WritingStudio } from '@/features/writing/components/writing-studio';
import { parseMentionExtensionSettings } from '@/features/extensions/mention-settings';
import { loadExtensionRuntimeAccess, loadWritingProject } from '@/features/writing/server';
import { isWritingView } from '@/features/writing/types';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Ambiente de escrita',
  description: 'Editor, capítulos, cenas, notas, Enciclopédia e relações da obra.',
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

  const [project, extensionAccess, mentionInstallation] = await Promise.all([
    loadWritingProject(supabase, userId, query.document, query.work),
    loadExtensionRuntimeAccess(supabase, userId),
    supabase.from('user_extension_installations').select('settings').eq('user_id', userId).eq('extension_id', 'lab.context-mentions').maybeSingle(),
  ]);

  return <WritingStudio userId={userId} initialProject={project} initialView={view} extensionAccess={extensionAccess} initialMentionSettings={parseMentionExtensionSettings(JSON.stringify(mentionInstallation.data?.settings ?? null))} />;
}
