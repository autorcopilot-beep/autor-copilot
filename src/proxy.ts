import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { refreshSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  if (/^\/admin\/(register|signup)(\/|$)/.test(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  return refreshSession(request);
}

export const config = {
  matcher: [
    '/login',
    '/forgot-password',
    '/update-password',
    '/onboarding/:path*',
    '/dashboard/:path*',
    '/write/:path*',
    '/account/:path*',
    '/admin/:path*',
  ],
};
