import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginEmailSettings } from '@/features/account/components/login-email-settings';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Login e e-mail' };

export default async function AccountLoginPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email: noticeParam } = await searchParams;
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) redirect('/login?next=/account/login');

  const user = userData.user;
  if (!user.email) redirect('/account');
  const notice = noticeParam === 'requested' || noticeParam === 'confirmed' || noticeParam === 'error' ? noticeParam : undefined;

  return (
    <div>
      <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Acesso à conta</p><h2 className="mt-1 font-serif text-2xl font-semibold text-ink">Login e e-mail</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Gerencie o endereço usado para entrar e acompanhe as informações principais de autenticação.</p></div>
      <LoginEmailSettings
        email={user.email}
        confirmedAt={user.email_confirmed_at}
        lastSignInAt={user.last_sign_in_at}
        provider={typeof user.app_metadata.provider === 'string' ? user.app_metadata.provider : 'email'}
        notice={notice}
      />
    </div>
  );
}
