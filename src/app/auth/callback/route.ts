import { NextResponse } from 'next/server';

import { getSiteUrl } from '@/config/env';
import { getSafeAuthDestination } from '@/features/auth/redirects';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const requestedDestination = requestUrl.searchParams.get('next');
  const destination = getSafeAuthDestination(requestedDestination, '/onboarding');
  const siteUrl = getSiteUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(destination, siteUrl));
    }
  }

  const errorPath = destination === '/update-password'
    ? '/forgot-password?error=link-expired'
    : destination === '/account/login'
      ? '/account/login?email=error'
    : destination === '/admin'
      ? '/admin/login?error=invite-expired'
      : '/register?error=confirmation';

  return NextResponse.redirect(new URL(errorPath, siteUrl));
}
