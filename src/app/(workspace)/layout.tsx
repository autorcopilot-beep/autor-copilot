import { redirect } from 'next/navigation';

import { WorkspaceShell } from '@/features/workspace/components/workspace-shell';
import { createClient } from '@/lib/supabase/server';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) redirect('/login?next=/dashboard');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, pen_name, onboarding_completed_at')
    .eq('id', userId)
    .single();

  if (!profile?.onboarding_completed_at) redirect('/onboarding');

  const email = typeof claimsData.claims.email === 'string' ? claimsData.claims.email : undefined;
  const { data: avatarProfile } = await supabase.from('profiles').select('avatar_path').eq('id', userId).maybeSingle();
  const { data: avatarData } = avatarProfile?.avatar_path
    ? await supabase.storage.from('profile-avatars').createSignedUrl(avatarProfile.avatar_path, 60 * 60)
    : { data: null };

  return <WorkspaceShell profile={{ displayName: profile.display_name, penName: profile.pen_name ?? undefined, email, avatarUrl: avatarData?.signedUrl }}>{children}</WorkspaceShell>;
}
