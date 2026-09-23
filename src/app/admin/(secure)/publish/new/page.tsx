import { OmniPublishStudio } from '@/features/admin/omnipublish/omnipublish-studio';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { communicationChannels, type CommunicationChannel } from '@/features/admin/omnipublish/types';

export default async function NewOmniPublishCampaignPage({ searchParams }: { searchParams: Promise<{ channel?: string }> }) {
  await requireAdmin('communications.manage');
  const { channel } = await searchParams;
  const supabase = createAdminClient();
  const [{ data: components }, { data: assets }] = await Promise.all([
    supabase.from('communication_components').select('*').eq('is_active', true).order('is_official', { ascending: false }).order('name'),
    supabase.from('communication_media_assets').select('*').order('created_at', { ascending: false }).limit(100),
  ]);
  const initialChannel = communicationChannels.includes(channel as CommunicationChannel) ? channel as CommunicationChannel : undefined;
  return <OmniPublishStudio initialComponents={components ?? []} initialAssets={assets ?? []} initialChannel={initialChannel} />;
}
