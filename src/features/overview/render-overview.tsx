import { redirect } from 'next/navigation';

import { OverviewPage } from '@/features/overview/components/overview-page';
import { loadOverview } from '@/features/overview/server';
import type { OverviewView } from '@/features/overview/types';
import { createClient } from '@/lib/supabase/server';

export async function renderOverview(view: OverviewView, workId?: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/overview/${view}`)}`);
  const overview = await loadOverview(supabase, userId, workId);
  return <OverviewPage view={view} {...overview} />;
}

