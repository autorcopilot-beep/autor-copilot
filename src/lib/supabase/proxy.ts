import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { getSupabaseEnv } from '@/config/env';
import type { Database } from '@/types/database.generated';

export async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Valida o token no servidor e renova cookies expirados quando necessário.
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const pathname = request.nextUrl.pathname;
  const protectedWorkspace = /^\/(dashboard|library|overview|write|account)(\/|$)/.test(pathname);
  if (userId && protectedWorkspace) {
    const { data: access } = await supabase.from('user_access_profiles').select('status').eq('user_id', userId).maybeSingle();
    if (access?.status === 'suspended') {
      const target = request.nextUrl.clone();
      target.pathname = '/login';
      target.search = '?error=account-suspended';
      return NextResponse.redirect(target);
    }
    if (access?.status === 'restricted' && pathname !== '/account') {
      const target = request.nextUrl.clone();
      target.pathname = '/account';
      target.search = '?status=restricted';
      return NextResponse.redirect(target);
    }
  }

  return response;
}
