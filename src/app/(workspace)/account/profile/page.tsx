import { redirect } from 'next/navigation';

import { ProfileForm } from '@/features/account/components/profile-form';
import { createClient } from '@/lib/supabase/server';

type AccountProfilePageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AccountProfilePage({ searchParams }: AccountProfilePageProps) {
  const { saved: savedParam } = await searchParams;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/login?next=/account/profile');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, full_name, nickname, pen_name, age, bio, writing_focus, experience_level, writing_genres, locale, country_code, timezone')
    .eq('id', userId)
    .single();
  if (!profile) redirect('/onboarding');

  const { data: profileExtras } = await supabase.from('profiles').select('username, avatar_path').eq('id', userId).maybeSingle();
  const { data: avatarData } = profileExtras?.avatar_path
    ? await supabase.storage.from('profile-avatars').createSignedUrl(profileExtras.avatar_path, 60 * 60)
    : { data: null };

  return (
    <div>
      <div className="mb-5"><h2 className="font-serif text-2xl font-semibold text-ink">Perfil</h2><p className="mt-1 text-sm text-muted">Atualize sua identidade e o contexto usado nas ferramentas de escrita.</p></div>
      <ProfileForm avatarUrl={avatarData?.signedUrl} saved={savedParam === 'identity' || savedParam === 'writing' || savedParam === 'region' ? savedParam : undefined} values={{
        fullName: profile.full_name || profile.display_name,
        nickname: profile.nickname || profile.display_name,
        username: profileExtras?.username || `usuario_${userId.replaceAll('-', '').slice(0, 10)}`,
        penName: profile.pen_name || '',
        age: profile.age,
        bio: profile.bio || '',
        writingFocus: profile.writing_focus || 'fiction',
        experienceLevel: profile.experience_level || 'starting',
        genres: profile.writing_genres,
        locale: profile.locale,
        countryCode: profile.country_code || '',
        timezone: profile.timezone,
      }} />
    </div>
  );
}
