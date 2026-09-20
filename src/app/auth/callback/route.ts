import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

const allowedDestinations = new Set(['/onboarding']);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const requestedDestination = requestUrl.searchParams.get('next');
  const destination = requestedDestination && allowedDestinations.has(requestedDestination)
    ? requestedDestination
    : '/onboarding';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/register?error=confirmation', requestUrl.origin));
}
