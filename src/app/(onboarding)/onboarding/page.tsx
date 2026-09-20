import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthBrand } from '@/features/auth/components/auth-brand';
import { ProfileForm } from '@/features/onboarding/components/profile-form';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Seu espaço de escrita' };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) redirect('/register');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, pen_name, writing_focus, experience_level, onboarding_completed_at')
    .eq('id', userId)
    .single();

  if (profile?.onboarding_completed_at) redirect('/dashboard');

  return (
    <main className="relative flex h-dvh items-center justify-center overflow-hidden px-3 pb-3 pt-[4.75rem] sm:px-6 sm:pb-5 sm:pt-20">
      <header className="absolute inset-x-3 top-3 mx-auto flex max-w-4xl items-center justify-between sm:inset-x-6 sm:top-5"><AuthBrand /><span className="hidden text-sm text-muted sm:block">Preparando seu perfil</span></header>
      <section className="auth-enter flex h-full max-h-[42rem] w-full max-w-5xl flex-col" aria-labelledby="welcome-title">
          <h1 id="welcome-title" className="sr-only">{profile?.display_name ? `${profile.display_name}, personalize seu espaço` : 'Personalize seu espaço'}</h1>
          <ProfileForm defaultPenName={profile?.pen_name ?? undefined} defaultWritingFocus={profile?.writing_focus ?? undefined} defaultExperienceLevel={profile?.experience_level ?? undefined} />
      </section>
    </main>
  );
}
