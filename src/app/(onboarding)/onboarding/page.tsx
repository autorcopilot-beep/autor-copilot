import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BookOpen } from 'lucide-react';

import { Badge, Card, CardContent } from '@/components/ui';
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
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <header className="mx-auto flex max-w-4xl items-center justify-between"><AuthBrand /><span className="hidden text-sm text-muted sm:block">Etapa 2 de 2 · Seu perfil</span></header>
      <Card className="auth-enter mx-auto my-8 w-full max-w-4xl bg-editor sm:my-12" aria-labelledby="welcome-title">
        <CardContent className="p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4"><Badge>Conta confirmada</Badge><span className="text-meta text-muted">Leva cerca de 1 minuto</span></div>
          <BookOpen className="mt-8 size-8 text-accent" aria-hidden="true" />
          <h1 id="welcome-title" className="mt-5 max-w-2xl font-serif text-4xl font-semibold leading-tight text-ink">{profile?.display_name ? `${profile.display_name}, como é a sua escrita?` : 'Como é a sua escrita?'}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">Conte somente o necessário para prepararmos um início relevante. Nenhuma escolha é permanente.</p>
          <ProfileForm defaultPenName={profile?.pen_name ?? undefined} defaultWritingFocus={profile?.writing_focus ?? undefined} defaultExperienceLevel={profile?.experience_level ?? undefined} />
        </CardContent>
      </Card>
    </main>
  );
}
