import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import type { CommunicationChannel } from '@/features/admin/omnipublish/types';

export async function loadPublicCatalog(channel: CommunicationChannel) {
  const supabase = createAdminClient();
  const [{ data: catalog }, { data: items }] = await Promise.all([
    supabase.from('communication_catalogs').select('*').eq('channel', channel).eq('is_public', true).maybeSingle(),
    supabase.from('communication_items').select('id, title, slug, public_path, payload, seo, published_at, communication_campaigns!inner(summary, campaign_tags, status)').eq('channel', channel).eq('status', 'published').eq('is_public', true).eq('communication_campaigns.status', 'published').order('published_at', { ascending: false }),
  ]);
  return { catalog, items: items ?? [] };
}

export async function loadPublicPublication(channel: CommunicationChannel, slugOrId: string) {
  const supabase = createAdminClient();
  let query = supabase.from('communication_items').select('id, title, slug, public_path, payload, seo, published_at, communication_campaigns!inner(summary, campaign_tags, status)').eq('channel', channel).eq('status', 'published').eq('is_public', true).eq('communication_campaigns.status', 'published');
  query = /^[0-9a-f-]{36}$/i.test(slugOrId) ? query.eq('id', slugOrId) : query.eq('slug', slugOrId);
  const { data } = await query.maybeSingle();
  return data;
}
