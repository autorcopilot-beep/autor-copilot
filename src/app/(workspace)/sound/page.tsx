import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SoundHub } from '@/features/sound/components/sound-hub';
import { loadSoundLibrary } from '@/features/sound/server';
import { loadExtensionRuntimeAccess } from '@/features/writing/server';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Media & Sound', description: 'Paisagens sonoras e áudio editorial para escrever com foco.' };

export default async function SoundPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect('/login?next=/sound');
  const access = await loadExtensionRuntimeAccess(supabase, userId);
  if (!access['lab.media-sound']) redirect('/account/extensions?install=lab.media-sound');
  const [tracks, settingsResult] = await Promise.all([
    loadSoundLibrary(supabase),
    supabase.from('audio_user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ]);
  return <SoundHub tracks={tracks} userId={userId} initialSettings={settingsResult.data} />;
}
